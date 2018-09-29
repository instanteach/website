// tslint:disable:jsx-no-lambda
import * as React from 'react'
import { Route, RouteProps, } from 'react-router'

import AppBar from './AppBar'

interface IContentProps {
  normal?: boolean
  padding?: boolean
}
interface IDefaultLayout extends RouteProps, IContentProps {
  triangle?: boolean;
  component: any;
}

const DefaultLayout: React.SFC<IDefaultLayout>  = ({ component, ...rest }) =>
  <Route {...rest} render={({ staticContext, ...matchProps }) => (
    <AppBar {...matchProps}>
      {React.cloneElement(component, {...matchProps})}
    </AppBar>
  )}
  />

export default DefaultLayout
