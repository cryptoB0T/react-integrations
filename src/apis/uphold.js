import axios from 'axios'

const URLS  = {
  codeForAccess: 'https://api-sandbox.uphold.com/oauth2/token',
  currencyTicker:  'https://api-sandbox.uphold.com/v0/ticker',
  account: 'https://api-sandbox.uphold.com/v0/me/accounts',
  cards: 'https://api-sandbox.uphold.com/v0/me/cards',
  transaction: '/transactions',
  userDetails: 'https://api-sandbox.uphold.com/v0/me'
};

// const POST_HEADER = {
//     'Content-Type': 'application/x-www-form-urlencoded'
// };

const AUTH_HEADER = {
    'Authorization' : `Bearer ${process.env.REACT_APP_UPHOLD_BEARER_CODE}`
};

export const upholdApi = {
    async getUserDetails() {
        const userDetails = await axios.request({
            method: 'get',
            url: URLS.userDetails,
            headers: AUTH_HEADER
        });
        console.log('User Details', userDetails);
        return userDetails;
    }
};
