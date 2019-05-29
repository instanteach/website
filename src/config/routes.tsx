import CssBaseline from '@material-ui/core/CssBaseline'
import * as React from 'react'
import * as ReactGA from 'react-ga'
import { Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import DefaultLayout from '../components/Layouts/DefaultLayout'
import PrivateLayout from '../components/Layouts/PrivateLayout'
import ProtectedLayout from '../components/Layouts/ProtectedLayout'

import About from '../components/Pages/About'
import Classroom from '../components/Pages/Classroom'
import Classrooms from '../components/Pages/Classrooms'
import Contact from '../components/Pages/Contact'
import Document from '../components/Pages/Document'
import Documents from '../components/Pages/Documents'
import Home from '../components/Pages/Home'
import Landing from '../components/Pages/Landing'
import Login from '../components/Pages/Login'
import MaterialGenerator from '../components/Pages/MaterialGenerator'
import Policy from '../components/Pages/Policy'
import Profile from '../components/Pages/Profile'
import RecoveryPassword from '../components/Pages/RecoveryPassword'
import Signup from '../components/Pages/Signup'
import Upload from '../components/Pages/Upload'
import UserList from '../components/Pages/UserList'

ReactGA.initialize('UA-122507387-1');

const fireTracking = () => ReactGA.pageview(window.location.hash)

const Routes = (props: any) => (
  <React.Fragment>
    <CssBaseline />
    <Router onUpdate={fireTracking} {...props}>
    <Switch>
      <DefaultLayout exact={true} path="/" component={<Home />} />
      <DefaultLayout exact={true} path="/home" component={<Home />} />
      <DefaultLayout exact={true} path="/land" component={<Landing />} />
      <DefaultLayout path="/document/:id" component={<Document match={{}} />} />
      <DefaultLayout exact={true} path="/lesson-plans" component={<Documents />} />
      <DefaultLayout exact={true} path="/contact" component={<Contact />} />
      <DefaultLayout exact={true} path="/about-us" component={<About />} />
      <DefaultLayout exact={true} path="/privacy-policy" component={<Policy />} />
      <DefaultLayout exact={true} path="/login" component={<Login />} />
      <DefaultLayout exact={true} path="/signup" component={<Signup />} />
      <DefaultLayout exact={true} path="/recovery-password" component={<RecoveryPassword />} />
      
			<PrivateLayout exact={true} path="/material-generator" component={<MaterialGenerator />} />
			<PrivateLayout path="/classroom/:id" component={<Classroom match={{}} />} />
			<PrivateLayout path="/my-students" component={<Classrooms />} />
			<PrivateLayout exact={true} path="/my-profile" component={<Profile />} />
			
			<ProtectedLayout exact={true} path="/upload" component={<Upload />} />
      <ProtectedLayout exact={true} path="/users" component={<UserList />} />
    </Switch>
  </Router>
  </React.Fragment>
);

export default Routes;
