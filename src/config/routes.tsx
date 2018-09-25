import * as React from 'react';
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom';

import App from '../App'

const Routes = (props: any) => (
  <Router {...props}>
    <Switch>
      <Route exact={true} path="/" component={App} />
    </Switch>
  </Router>
);

export default Routes;
