pragma solidity ^0.4.18;
import './SafeMath.sol';
import './MyBitToken.sol'; 
import './Database.sol'; 



// NOTE: If no stakers during period Wei is sent, then it will be unclaimed
// TODO: prevent users from accidentally transferring in tokens 
// TODO: add pause mechanism
contract TokenStake { 
using SafeMath for *; 

  // --------MyBit Contracts-----------------
  MyBitToken public myBitToken; 
  Database public database; 

  //-----User variables-----//
  mapping (address => uint) public feesOwed; 
  mapping (bytes32 => Stake) public stakes; 

  //-----Payout Info------//
  uint[] public multipliers;
  uint[] public stakeTimes; 
  uint[] public numberOfNonces; 
  uint public totalStakedTokens; 
  

 //-----Period Info-------// 
  uint public periodLength; 
  uint public nextPeriod;
  mapping (uint => uint) public multipliedTokensInPeriod;
  mapping (uint => uint) public feesReceivedAtNonce; 
  uint public periodNonce; 

  bool private rentrancy_lock = false;    // Prevents re-entrancy attack



  struct Stake {
    uint periodIndex;  //The length of the lock
    uint amountStaked;
    uint multipliedAmount; 
    uint multipliedAmountFirstNonce; 
    uint nonceAtStake;
    uint nonceAtUnlock;
    uint blockAtStake; 
  }


  function TokenStake(address _myBitToken, address _database) 
  public {
    myBitToken = MyBitToken(_myBitToken);
    database = Database(_database); 
    multipliers = [625,1250, 2500, 5000]; 
    // stakeTimes = [277714, 1388571, 2777142, 5554285];
    stakeTimes = [45, 90, 180, 360];           // TODO: Testing numbers 
    numberOfNonces = [1, 2, 4, 8];
    periodLength = 45; 
    nextPeriod = periodLength.add(block.number); 
    periodNonce = 0; 
  }


  // Once users approve TokenStaking contract, they can stake tokens here
  // NOTE: If user locks same number of tokens on the same block, they will lose their tokens as their mapping will be overwritten
  // @Param: The period index: 0:45, 1:90, 2:180, 3:360 
  function lockTokens(uint _period, uint _amount)
  external
  periodUpToDate
  onlyApproved
  whenNotPaused
  returns (bool) { 
    require (_amount > 0 && _period < 4);
    require (myBitToken.transferFrom(msg.sender, this, _amount));
    Stake storage thisStake = stakes[keccak256(msg.sender, block.number, _amount)];
    thisStake.nonceAtStake = periodNonce;
    thisStake.periodIndex = _period;
    thisStake.amountStaked = _amount;
    thisStake.blockAtStake = block.number; 
    thisStake.multipliedAmount = _amount.add(multipliers[_period].mul(_amount).div(10000));
    thisStake.multipliedAmountFirstNonce = thisStake.multipliedAmount.mul((nextPeriod.sub(block.number))).div(periodLength);
    thisStake.nonceAtUnlock = periodNonce.add(numberOfNonces[_period]); 
    multipliedTokensInPeriod[periodNonce] = multipliedTokensInPeriod[periodNonce].add(thisStake.multipliedAmountFirstNonce); 
    totalStakedTokens = totalStakedTokens.add(_amount);
    fillMultipliedTokensForNonce(periodNonce.add(1), thisStake.nonceAtUnlock, thisStake.multipliedAmount);
    LogTokensStaked(msg.sender, block.number, keccak256(msg.sender, block.number, _amount)); 
    return true;
}

  // Once required lock time has passed users can retrieve their funds here 
  function unlockTokens(bytes32 _lockID) 
  external
  nonReentrant
  periodUpToDate
  onlyApproved
  whenNotPaused
  ownerOfLock(_lockID)
  stakingFinished(_lockID)
  returns (bool) {
    Stake memory thisStake = stakes[_lockID]; 
    myBitToken.transfer(msg.sender, thisStake.amountStaked);   // If transfer() fails the call will bubble up
    uint owedToUser = feesReceivedAtNonce[thisStake.nonceAtStake].calculateOwed(multipliedTokensInPeriod[thisStake.nonceAtStake], thisStake.multipliedAmountFirstNonce);
    for (uint i = (thisStake.nonceAtStake + 1); i < thisStake.nonceAtUnlock; i++) {
      owedToUser = owedToUser.add(feesReceivedAtNonce[i].calculateOwed(multipliedTokensInPeriod[i], thisStake.multipliedAmount)); 
    }
    delete stakes[_lockID];
    msg.sender.transfer(owedToUser); 
    LogTokenWithdraw(msg.sender, block.number, _lockID); 
    return true;
  }

  // Asset contracts send fee here 
  function receiveReward() 
  external 
  payable
  requiresEther
  periodUpToDate 
  { 
    feesReceivedAtNonce[periodNonce] = feesReceivedAtNonce[periodNonce].add(msg.value);
    LogFeeReceived(msg.sender, periodNonce, msg.value); 
  }

  function fillMultipliedTokensForNonce(uint256 _startingNonce, uint _endingNonce, uint256 _totalMultipliedAmount)
  internal { 
    for (_startingNonce; _startingNonce < _endingNonce; _startingNonce++) { 
      multipliedTokensInPeriod[_startingNonce] = multipliedTokensInPeriod[_startingNonce].add(_totalMultipliedAmount); 
    }
  }

  // Must be authorized by 1 of the 3 owners and then can be called by any of the other 2
  // Invariants: Must be 1 of 3 owners. Cannot be called by same owner who authorized the function to be called.
  // TODO: need to transfer all MYB tokens out before calling this 
  function destroy(address _functionInitiator, address _holdingAddress) 
  anyOwner 
  public {
    require(_functionInitiator != msg.sender); 
    require(database.boolStorage(keccak256(this, _functionInitiator, "destroy", keccak256(_holdingAddress))));
    LogDestruction(_holdingAddress, this.balance, msg.sender); 
    selfdestruct(_holdingAddress);
  }


// ------------------------------------Getters-------------------------------------------------
  function getStakeInfo(bytes32 _stakeID)
  view
  external 
  returns(uint, uint, uint, uint, uint, uint, uint) { 
    return (stakes[_stakeID].periodIndex, stakes[_stakeID].amountStaked, stakes[_stakeID].multipliedAmountFirstNonce, stakes[_stakeID].multipliedAmount, stakes[_stakeID].nonceAtStake, stakes[_stakeID].nonceAtUnlock, stakes[_stakeID].blockAtStake); 
  }  

  function getBalance()
  view 
  external 
  returns (uint) {
    return this.balance;
  }

  function() 
  public {
    revert();
  }

  modifier onlyApproved { 
    require(database.uintStorage(keccak256("userAccess", msg.sender)) >= 3);
    _; 
  }
  
  modifier whenNotPaused { 
    require(!database.boolStorage(keccak256("pause", this)));
    _; 
  }

  modifier requiresEther {
    require(msg.value > 0);
    _;
  }

  modifier nonReentrant() {
    require(!rentrancy_lock);
    rentrancy_lock = true;
    _;
    rentrancy_lock = false;
  }

  modifier ownerOfLock(bytes32 _ID) { 
    Stake memory thisStake = stakes[_ID];
    require(_ID == keccak256(msg.sender, thisStake.blockAtStake, thisStake.amountStaked)); 
    _;
  }

  modifier stakingFinished(bytes32 _ID) {
    require(stakes[_ID].nonceAtUnlock <= periodNonce);
    _;
  }

  modifier periodUpToDate { 
    while (block.number >= nextPeriod) { 
      periodNonce++;
      nextPeriod = nextPeriod.add(periodLength); 
    }
    _;
  }

  modifier anyOwner { 
    require(database.boolStorage(keccak256("owner", msg.sender)));
    _;
  }

  event LogDestruction(address indexed _locationSent, uint256 indexed _amountSent, address indexed _caller); 
  event LogFeeReceived(address indexed _sender, uint indexed _currentNonce, uint indexed _amount); 
  event LogTokensStaked(address indexed _staker, uint indexed _blockNumber, bytes32 indexed _ID); 
  event LogTokenWithdraw(address indexed _staker, uint indexed _blockNumber, bytes32 indexed _ID);


}
