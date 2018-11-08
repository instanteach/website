import * as React from 'react'
import styled from 'styled-components'

const TellForm = styled('iframe')`
  border: none;
  padding-bottom: 20px;
  width: 100%;
  height: 90%
`

class MaterialGenerator extends React.PureComponent {
  public render() {
    return (
      <TellForm id="iframe" src="https://instanteach.tellform.com/#!/forms/5bcb4c11b0fd8a6456f09146">
        Loading..
      </TellForm>
    )
  }
}

export default MaterialGenerator
