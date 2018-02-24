import React, { Component } from 'react';

import { GetUserDetails } from './components/GetUserDetails'

class UpholdApp extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Uphold API React Integration Example</h1>
        </header>
        <div className="App-wrapper">
            <p className="App-intro">
                <GetUserDetails />
            </p>
        </div>
    </div>
    )
  }  
}

export default UpholdApp;

  