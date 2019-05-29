import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import styled from 'styled-components'
import FacebookMessengerIcon from '../../assets/images/icons/messenger.png'

const LinkWrapper = styled('div')`
  padding: 50px 0 50px 0;
  display: flex;
  width: 100%;
  justify-content: space-around;
  a {
    text-decoration: none;
    color: black;
    svg {
      height: 50px;
      width: 50px;
      transition: transform 0.5s;
      :hover {
        transform: scale(1.2);
      }
    }
  }
`

const FacebookMessenger = styled('img')`
  width: 45px;
  color: black;
  transition-duration: .5s;
  &:hover {
    transform: scale(1.2);
  }
`

class Contact extends React.PureComponent {
  public render() {
    return <Card style={{ padding: '10px' }}>
      <Typography variant="display1" component="p" paragraph={true}>
        Talk to a human!
      </Typography>
      <Typography variant="subheading" component="p" paragraph={true}>
        If you have a problem, suggestion, piece of feedback or just a general question, we are always ready and here to help, teacher to teacher.
      </Typography>
      <Typography variant="title" component="p" paragraph={true}>
        Contact Us Through: 
      </Typography>
      <LinkWrapper>
        <a target="_blank" href="mailto:instanteach.io@gmail.com">
          <FaEnvelope />
        </a>
        <a target="_blank" href="https://wa.me/+5215539504779">
          <FaWhatsapp />
        </a>
        <a target="_blank" href="https://m.me/instanteach">
          <FacebookMessenger src={FacebookMessengerIcon} />
        </a>
      </LinkWrapper>
    </Card>
  }
}

export default Contact
