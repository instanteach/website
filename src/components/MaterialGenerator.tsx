import * as React from "react";
import styled from "styled-components";

const Form = styled("iframe")`
  border: none;
  padding-bottom: 20px;
`;

class MaterialGenerator extends React.PureComponent {
  public render() {
    return (
      <Form
        src="https://zdenka.tellform.com/#!/forms/5bdfd56c0ec65c75274d3218"
        width="100%"
        height="90%"
      >
        Loading...
      </Form>
    );
  }
}

export default MaterialGenerator;
