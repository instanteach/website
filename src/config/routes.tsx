import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout'

import Home from '../components/Home'
import MaterialGenerator from '../components/MaterialGenerator'

const Routes = (props: any) => (
  <React.Fragment>
    <CssBaseline />
    <Router {...props}>
    <Switch>
      <DefaultLayout exact={true} path="/" component={<Home />} />
      <DefaultLayout exact={true} path="/material-generator" component={<MaterialGenerator />} />
    </Switch>
  </Router>
  </React.Fragment>
);

export default Routes;