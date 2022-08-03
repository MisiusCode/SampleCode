import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from './containers/login'
import MainPage from './containers/main'
import OptionsPage from './containers/options'

function Routes() {
  return (
    <Router>
        <Route exact path="/" component={LoginPage} />
        <Route path="/options" component={OptionsPage} />
        <Route path="/main" component={MainPage} />
    </Router>
  );
}

export default Routes;
