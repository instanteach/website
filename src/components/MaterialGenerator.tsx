import * as React from 'react'
import styled from 'styled-components'

const GoogleForm = styled('iframe')`
  border: none;
  padding-bottom: 100px;
`

class MaterialGenerator extends React.PureComponent {
  public render() {
    return <GoogleForm
    src="https://docs.google.com/forms/d/e/1FAIpQLScBhRXAHDeXw8BupK1LwOGwPeK3PhZ4HJmypVaOJWaXv__0gA/viewform?embedded=true"
    width="100%"
    height="100%">
    Loading...
  </GoogleForm>
  }
}

export default MaterialGenerator
