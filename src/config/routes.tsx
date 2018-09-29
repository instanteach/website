import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout'

import About from '../components/About'
import Contact from '../components/Contact'
import Home from '../components/Home'
import MaterialGenerator from '../components/MaterialGenerator'
import Policy from '../components/Policy'

const Routes = (props: any) => (
  <React.Fragment>
    <CssBaseline />
    <Router {...props}>
    <Switch>
      <DefaultLayout exact={true} path="/" component={<Home />} />
      <DefaultLayout exact={true} path="/material-generator" component={<MaterialGenerator />} />
      <DefaultLayout exact={true} path="/contact" component={<Contact />} />
      <DefaultLayout exact={true} path="/about-us" component={<About />} />
      <DefaultLayout exact={true} path="/privacy-policy" component={<Policy />} />
    </Switch>
  </Router>
  </React.Fragment>
);

export default Routes;
