import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import StatisticsPage from "./pages/Statistics";

const App: React.VFC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/stats" component={StatisticsPage} />
      </Switch>
    </Router>
  );
};

export default App;
