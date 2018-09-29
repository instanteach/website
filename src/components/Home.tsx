import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled('div')`
  h1, h2, h3 {
    padding-bottom: 15px;
  }
  p {
    padding-bottom: 5px;
  }
`

class Home extends React.PureComponent {
  public render() {
    return <Wrapper>
      <Typography variant="headline" component="h1">
        Get Free Personalized English Teaching Printables, Resources and Lesson Plans For ESL Students That Are Personalized For Your Students In Record Time!
      </Typography>
      <Typography variant="subheading" component="h2">
        Us teachers have so many things to do every day and we sadly spend such loooong hours in preparing all our classes...if only there was... Instanteach!
      </Typography>
      <Typography variant="subheading" component="h3">
        We have built the first version of an "English Material Generator", in order to save us all hours of work and to give you material of the highest quality for your students in just a few seconds.
      </Typography>
      <Typography variant="title" component="p">
        How does it work?
      </Typography>
      <ol>
        <li>
          <Typography component="p">
            Open the Material Generator
          </Typography>
        </li>
        <li>
          <Typography component="p">
            Give us some basic info about your class
          </Typography>
        </li>
        <li>
          <Typography component="p">
            Submit! You'll receive an email within 24h with ready-to-use material personalized to your students' neccesities
          </Typography>
        </li>
        <li>
          <Typography component="p">
            And Repeat! You can resubmit the form as many times as you need for as many groups as you have 😉
          </Typography>
        </li>
      </ol>
      <Link to="/material-generator">
        <Button color="primary" variant="contained">Go</Button>
      </Link>
      
    </Wrapper>
  }
}

export default Home
