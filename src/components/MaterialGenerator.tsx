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
      <TellForm id="iframe" src="https://zdenka.tellform.com/#!/forms/5bdfd56c0ec65c75274d3218">
        Loading..
      </TellForm>
    )
  }
}

export default MaterialGenerator
