import * as React from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'
import DocumentsService from 'src/services/DocumentsService';

interface IState {
  category: string
  folder: string
  level: string
  message: boolean
}

const Form = styled('form')`
  width: 100%;
`

const inputStyles = {
  marginBottom: '1rem',
  width: '100%'
}

const gridStyles = {
  minHeight: '90%'
}

class Upload extends React.PureComponent<{}, IState> {
  public state = {
    category: "",
    folder: "",
    level: "",
    message: false
  }

  public handleChange = name => event => {
    this.setState({
      ...this.state,
      message: false,
      [name]: event.target.value
    })
  }
  
  public submit = e => {
    e.preventDefault()
    const {level, category, folder} = this.state
    const file = e.target.file.files[0]
    if(level.length>0 && category.length>0 && file) {
      DocumentsService.store(level, category, folder, file)
      this.setState({
        message: true
      })
    }
  }

  public handleClose = () => {
    this.setState({
      message: false
    })
  }

  public render() {
    const {level, category, folder, message} = this.state
    return (
      <Grid container={true} spacing={16} style={gridStyles} direction="row" justify="center" alignItems="center">
        <Grid item={true} container={true} xs={6}>
          <Form onSubmit={this.submit}>
            <Grid item={true} xs={12}>
              <TextField
                label="Level"
                defaultValue={level}
                name="level"
                type="text"
                onChange={this.handleChange('level')}
                variant="outlined"
                required={true}
                style={inputStyles} />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="Category"
                defaultValue={category}
                name="category"
                type="text"
                onChange={this.handleChange('category')}
                variant="outlined"
                required={true}
                style={inputStyles} />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="Folder (Optional)"
                defaultValue={folder}
                name="folder"
                type="text"
                onChange={this.handleChange('folder')}
                variant="outlined"
                style={inputStyles} />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                name="file"
                type="file"
                variant="outlined"
                required={true}
                style={inputStyles} />
            </Grid>
            <Grid item={true} container={true} xs={12} justify="flex-end">
              <Button size="medium" variant="contained" color="primary" type="submit">Upload File</Button>
            </Grid>
          </Form>
          <Snackbar
            open={message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">File uploaded successfully!</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              ><CloseIcon /></IconButton>
            ]}/>
        </Grid>
      </Grid>
    )
  }
}

export default Upload
