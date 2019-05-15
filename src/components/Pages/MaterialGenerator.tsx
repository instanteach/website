import * as React from "react";
import styled from "styled-components";

const TellForm = styled('iframe')`
  border: none;
  padding-bottom: 20px;
	width: 100%;
	height: 500px;
  max-height: 90%
`

class MaterialGenerator extends React.PureComponent {
  public render() {
    return (
      <TellForm id="iframe" src="https://instanteach.typeform.com/to/DGwwuX">
        Loading..
      </TellForm>
    )
  }
}

export default MaterialGenerator;
