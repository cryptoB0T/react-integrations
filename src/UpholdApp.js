import React, { Component } from 'react';

import { upholdApi } from './apis/uphold'

class UpholdApp extends Component {
  
  constructor(props) {
    super(props)
    this.getUserDetails = this.getUserDetails.bind(this)
  }
  
  getUserDetails() {
    upholdApi.getUserDetails()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Uphold API React Integration Example</h1>
        </header>
        <div className="App-wrapper">
            <p className="App-intro">
                <button onClick={this.getUserDetails}>Get User Details</button>
            </p>
        </div>
    </div>
    )
  }  
}

export default UpholdApp;

  