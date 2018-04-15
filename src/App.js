import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Button } from 'carbon-components-react';
import './Button.scss';

import Web3App from './Web3App'
import UpholdApp from './UpholdApp'

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Button onClick={() => console.log('Clicked primary button')}>
            <Link to="/">Web3App</Link>
          </Button>
        </li>
        <li>
          <Button kind="secondary" onClick={() => console.log('Clicked secondary button')}>
            <Link to="/uphold">Uphold</Link>
          </Button>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Web3App} />
      <Route path="/uphold" component={UpholdApp} />
    </div>
  </Router>
);

export default App;
