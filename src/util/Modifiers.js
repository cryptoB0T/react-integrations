import { keccak256 } from 'js-sha3';


export default class Modifiers {

    async load(databaseInstance, web3) {
        this.web3 = web3;
        this.database = databaseInstance;
    }

    // Funding Hub Modifiers
    async fundingLimitValue(_assetID){
      const { database } = this.state
      return (database.uintStorageAsync(keccak256("amountRaised", _assetID)) < database.uintStorageAsync(keccak256("amountToBeRaised", _assetID)));
    }

    async fundingLimitTime(_assetID){
      const { database } = this.state
      return ((new Date()).getTime() <= database.uintStorageAsync(keccak256("fundingDeadline", _assetID)));
    }

    async onlyApproved(_level){
      const { web3, database } = this.state
      return (database.uintStorageAsync(keccak256("userAccess", web3.eth.coinbase)) >= _level);
    }

    async atStage(_assetID, _stage){
      const { database } = this.state;
      return (database.uintStorageAsync(keccak256("fundingStage", _assetID)) === _stage);
    }

    async fundingPeriodOver(_assetID){
      const { database } = this.state;
      return ((new Date()).getTime() >= database.uintStorage(keccak256("fundingDeadline", _assetID)));
    }

    // MarketPlace
    async hasEnoughShares(_assetID, _requiredShares){
      const { database, web3 } = this.state;
      return (database.uintStorage(keccak256("shares", _assetID, web3.eth.coinbase)) >= _requiredShares)
    }

    //whenNotPaused
    //

    async accessLevel(){
      const { database, web3 } = this.state;
      return (database.uintStorage(keccak256("userAccess", web3.eth.coinbase)));
    }

    async withdrawalAddressSet(){
      const { database, web3 } = this.state;
      return (database.addressStorage(keccak256("withdrawalAddress", web3.eth.coinbase)) !== '0x0')
    }

    notZero(_uint){
      return (_uint > 0);
    }
}
