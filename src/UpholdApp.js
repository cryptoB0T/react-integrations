import React, { Component } from 'react';
import $ from 'jquery';

import { upholdApi } from './apis/uphold';

class UpholdApp extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Uphold API React Integration Example</h1>
        </header>
        <div className="App-wrapper">
            <p className="App-intro">
              <br />
              {
                <button
                key={'userDetails'}
                onClick={() => upholdApi.userDetails($('#userDetails-_accessToken').val())}
                >
                {'Get User Details'}
                </button>
            }
            _accessToken:<input type="text" id="userDetails-_accessToken"></input>

            <br />
            <br />
            {
              <button
              key={'userVerified'}
              onClick={() => upholdApi.userVerified($('#userVerified-_accessToken').val())}
              >
              {'Get User Verified'}
              </button>
          }
          _accessToken:<input type="text" id="userVerified-_accessToken"></input>

          <br />
          <br />
          {
            <button
            key={'tempToken'}
            onClick={() => upholdApi.accessToken($('#accessToken-_tempToken').val())}
            >
            {'Get Access Token'}
            </button>
        }
          _tempToken:<input type="text" id="accessToken-_tempToken"></input>

            <br />
            <br />
            {
              <button
              key={'currencyTicker'}
              onClick={() => upholdApi.currencyTicker()}
              >
              {'Get Currency Tickers'}
              </button>
          }


          <br />
          <br />
          {
            <button
            key={'accounts'}
            onClick={() => upholdApi.accounts()}
            >
            {'Get Currency Tickers'}
            </button>
        }
        _accessToken:<input type="text" id="accessToken-_tempToken"></input>





            </p>
        </div>
    </div>
    )
  }
}

export default UpholdApp;
