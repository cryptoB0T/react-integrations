import axios from 'axios'

const URLS  = {
  codeForAccess: 'https://api-sandbox.uphold.com/oauth2/token',
  currencyTicker:  'https://api-sandbox.uphold.com/v0/ticker',
  account: 'https://api-sandbox.uphold.com/v0/me/accounts',
  cards: 'https://api-sandbox.uphold.com/v0/me/cards',
  transaction: '/transactions',
  userDetails: 'https://api-sandbox.uphold.com/v0/me'
};

const POST_HEADER = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

// The Bearer code will be stored in bigchainDB
const AUTH_HEADER = {
    'Authorization' : ''
};

export const upholdApi = {
    async getUserDetails(_accessToken) {
      AUTH_HEADER = 'Bearer ' + _accessToken;
        const userDetails = await axios.request({
            method: 'get',
            url: URLS.userDetails,
            headers: AUTH_HEADER
        })
        console.log('User Details', userDetails);
        return userDetails;
    }


    async getUserVerified(_accessToken) {
      AUTH_HEADER = 'Bearer ' + _accessToken;
      const userVerified = await axois.request({
        method: 'get',
        url: URLS.userDetails,
        header: AUTH_HEADER
      })
      console.log('User Verified: ', userVerified);
      return userVerified;
    }


    async getAccessToken(_tempToken){
      const acessToken = await axois.request({
        method: 'get',
        url: URLS.codeForAccess,
        header: AUTH_HEADER,
      })
      console.log('Access Token: ', acessToken);
      return acessToken;
    }

    async currencyTicker(_accessToken){
      const currencyResult = await axois.request({
        method: 'get',
        url: URLS.currencyTicker,
        header: AUTH_HEADER
      })
      console.log('Currency result:', currencyResult);
      return currencyResult;
    }

    async getAccounts(_accessToken){
      AUTH_HEADER = 'Bearer ' + _accessToken;
      const accounts = await axois.request({
        method:'get',
        url: URLS.accounts,
        header: AUTH_HEADER
      })
      console.log('Account results', accounts);
      return accounts;
    }

    async getCards(_accessToken){
      AUTH_HEADER = 'Bearer ' + _accessToken;
      const cards = await axois.request({
        method: 'get',
        url: URLS.cards,
        header: AUTH_HEADER
      })
      console.log('Cards: ', cards);
      return cards;
    }

    async getSpecificCardEthAddress(_accessToken, _cardLabel){
      AUTH_HEADER = 'Bearer ' + _accessToken;
      let ethAddr ='0x0';
      const results = await axois.request({
        method: 'get',
        url: URLS.cards,
        header: AUTH_HEADER
      })
      var resultJson = JSON.parse(results);
      resultJson.forEach(function(card){
        if(card.label == _cardLabel){
          ethAddr = card.address.ethereum;
        }
      });
      return ethAddr;
    }

    async getCardID(_accessToken, _cardLabel){
      AUTH_HEADER = 'Bearer ' + _accessToken;
      let cardId = '';
      const results = await axois.request({
        method: 'get',
        url: URLS.cards,
        header: AUTH_HEADER
      })
      var resultJson = JSON.parse(results);
      resultJson.forEach(function(card){
        if(card.label == _cardLabel){
          cardId = card.id;
        }
      })
      return cardId;
    }

    async getCardTransactions(_accessToken, _cardLabel){
      AUTH_HEADER = 'Bearer ' + _accessToken;
      let cardTransactions = '';
      const results = await axois.request({
        method: 'get',
        url: URLS.cards,
        header: AUTH_HEADER
      })
      var resultJson = JSON.parse(results);
      resultJson.forEach(function(card){
        if(card.label == _cardLabel){
          cardId = card.id;
          const transactions = await axois.request({
            method: 'get',
            url: URLS.cards,
            header: AUTH_HEADER
          });
          return JSON.parse(transactions);
        }
      })
    }

  }
