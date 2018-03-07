import { keccak256 } from 'js-sha3';


export default class Modifier {

    async load(databaseInstance, web3) {
        this.web3 = web3;
        this.database = databaseInstance;
    }

    // Funding Hub Modifiers
    async fundingLimitValue(_assetID){
      return (await this.database.uintStorage(keccak256("amountRaised", _assetID)) < this.database.uintStorage(keccak256("amountToBeRaised", _assetID)));
    }

    async fundingLimitTime(_assetID){
      return ((new Date()).getTime() <= await this.database.uintStorage(keccak256("fundingDeadline", _assetID)));
    }

    async onlyApproved(_level){
      return (await this.database.uintStorage(keccak256("userAccess", this.web3.eth.coinbase)) >= _level);
    }

    async atStage(_assetID, _stage){
      return (await this.database.uintStorage(keccak256("fundingStage", _assetID)) === _stage);
    }

    async fundingPeriodOver(_assetID){
      return ((new Date()).getTime() >= await this.database.uintStorage(keccak256("fundingDeadline", _assetID)));
    }

    // MarketPlace
    async hasEnoughShares(_assetID, _requiredShares){
      return (await this.database.uintStorage(keccak256("shares", _assetID, this.web3.eth.coinbase)) >= _requiredShares)
    }

    //whenNotPaused
    //

    async accessLevel(){
      return (await this.database.uintStorage(keccak256("userAccess", this.web3.eth.coinbase)));
    }

    async withdrawalAddressSet(){
      return (await this.database.addressStorage(keccak256("withdrawalAddress", this.web3.eth.coinbase)) !== '0x0')
    }

    notZero(_uint){
      return (_uint > 0);
    }
}
