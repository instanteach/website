import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { FaFacebookSquare, FaInstagram, FaYoutubeSquare } from 'react-icons/fa'
import styled from 'styled-components'

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

const Conrado = styled('div')`
  padding: 50px 0 50px 0;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  @media (max-width: 500px) {
    flex-direction: column;
    text-align: center;
    .conradoAvatar {
      height: 100px !important;
      width: 100px !important;
    }
  }
  p {
    color: rgba(38, 72, 186, 1);
    width: 80%;
  }
`

class About extends React.PureComponent {
  public render() {
    return <Card style={{ padding: '10px' }}>
      <Typography variant="display1" component="p" paragraph={true}>
        Thanks for wanting to know more about us!
      </Typography>
      <Typography variant="subheading" component="p" paragraph={true}>
        Instanteach is an educational project that aims to help English teachers from around the world. Instanteach has two big, clear and ambitious objectives:
      </Typography>
      <ul>
        <li>
        <Typography variant="subheading" component="p" paragraph={true}>
          Save Hours Of Work For Teachers Around the World
        </Typography>
        </li>
        <li>
          <Typography variant="subheading" component="p" paragraph={true}>
            Give Students Personalized Material That Meets Their Needs
          </Typography>
        </li>
      </ul>
      <Typography variant="subheading" component="p" paragraph={true}>
        We have observed in the last years that many companies have been putting technology to service for education, but always with a focus on students or on School Administration, but a key group is not being helped enough: Us teachers!
      </Typography>
      <Typography variant="subheading" component="p" paragraph={true}>
        Instanteach wishes to balance the field and provide a time-saving and class-improving service free for all teachers! But of course, if you wish to support this project, you can do so through here.
      </Typography>
      <Typography variant="title" component="p" paragraph={true}>
        Follow us on
      </Typography>
      <LinkWrapper>
        <a target="_blank" href="https://www.facebook.com/instanteach/">
          <FaFacebookSquare />
        </a>
        <a target="_blank" href="https://www.instagram.com/instanteach/">
          <FaInstagram />
        </a>
        <a target="_blank" href="https://www.youtube.com/channel/UCnonI8aWpLj7OczXRKJogbw">
          <FaYoutubeSquare />
        </a>
      </LinkWrapper>
      <Divider />
      <Conrado>
        <Avatar
          className="conradoAvatar"
          style={{
            height: 'auto',
            width: '15%',
          }}
          alt="Conrad Wilkinson Schwarz"
          src={`${process.env.PUBLIC_URL}/images/conrad.png`}
        />
        <Typography variant="display1" component="p">
          Conrad WS
        </Typography>
      </Conrado>
      <Typography variant="subheading" component="p" paragraph={true}>
        I'm Conrad, I studied Economics and International Development. I have always been fascinated by business, technology and education. I moved to Mexico in 2015 and started to work as a coordinator in a language school. Then I decided to work independently and ever since I have been teaching to private students as well as business classes in companies. My preferred way of teaching would comprehensible input and material personalization. Feel free to contact me for a question or just a general chat 😃
      </Typography>
			<br/>
			<Divider />
      <Conrado>
        <Avatar
          className="conradoAvatar"
          style={{
            height: 'auto',
            width: '15%',
          }}
          alt="John Mulders"
          src={`${process.env.PUBLIC_URL}/images/john.png`}
        />
        <Typography variant="display1" component="p">
					John Mulders
        </Typography>
      </Conrado>
      <Typography variant="subheading" component="p" paragraph={true}>
			My name’s John Mulders and I have been a teacher for more than fifteen years. I have worked in primary education, secondary education and at a language institute. During all these years I have worked hard – as most teachers do – on finding the best lessons for my students. The daily business, the amount of students and the demanding administration have challenged me throughout time. I am thrilled to be a part of Instanteach. I am convinced that the material generator will help us teachers win time!
      </Typography>
    </Card>
  }
}

export default About
