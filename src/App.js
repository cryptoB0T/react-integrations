import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Web3App from './Web3App'
import UpholdApp from './UpholdApp'
import AssetApp from './apps/AssetApp'

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Web3App</Link>
        </li>
        <li>
          <Link to="/uphold">Uphold</Link>
        </li>
        <li>
        <Link to="/asset">Asset</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Web3App} />
      <Route path="/uphold" component={UpholdApp} />
      <Route path="/asset" component={AssetApp} />

    </div>
  </Router>
);

export default App;
