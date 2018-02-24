import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Web3App from './Web3App'
import UpholdApp from './UpholdApp'

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
      </ul>

      <hr />

      <Route exact path="/" component={Web3App} />
      <Route path="/uphold" component={UpholdApp} />
    </div>
  </Router>
);

export default App;