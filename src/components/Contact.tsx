import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

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
      <Typography variant="subheading" component="p" paragraph={true}>
        Email: <a href='mailto:instanteach.io@gmail.com'>instanteach.io@gmail.com</a>
      </Typography>
      <Typography variant="subheading" component="p" paragraph={true}>
        Whatsapp: <a target="_blank" href='https://wa.me/+5215539504779'>https://wa.me/+5215539504779</a>
      </Typography>
      <Typography variant="subheading" component="p" paragraph={true}>
        Facebook Messenger: <a target="_blank" href='https://m.me/instanteach'>https://m.me/instanteach</a>
      </Typography>
    </Card>
  }
}

export default Contact
