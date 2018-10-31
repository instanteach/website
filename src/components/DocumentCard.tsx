import * as React from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography';
import DocumentsService from 'src/services/DocumentsService';

interface IState {
    url: string
}

interface IProps {
    clicked: boolean
    name: string
    type: string
    url: string
}

const Card = styled('div')`
    display: flex;
    flex-flow: row nowrap;
    box-shadow: 1px 2px 1px rgba(0,0,0,.2);
    border-radius: 4px;
    overflow: hidden;
`

const CardTypeFile = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    color: white;
    font-weight: bold;
    width: 25%;
    background-color: #C62828;
`

const CardContent = styled('div')`
    display: flex;
    position: relative;
    flex-flow: column nowrap;
    padding: 1rem;
    padding-bottom: 2rem;
    height: 100px;
    width: 75%;
`

const CardActions = styled('div')`
    position: absolute;
    bottom: 0;
    right: 0;
    margin-top: 1rem;
`

class DocumentCard extends React.Component<IProps, IState> {
    public state = {
       url: ""
    }

    public async componentDidMount() {
        const {url} = this.props

        DocumentsService.download(url).then(response => {
            this.setState({
                url: response
            })
        })
    }

    public render(): JSX.Element {
        const {clicked, type, name} = this.props
        const {url} = this.state
        return (
            <Grow in={clicked} style={{ marginBottom: '2rem' }}>
                <Grid item={true} xs={6}>
                    <Card>
                        <CardTypeFile style={
                            (type === 'doc' || type === 'docx')
                            ? { backgroundColor: '#1565C0' }
                            : (type === 'jpg')
                                ? { backgroundColor: '#E0E0E0', color: '#888' }
                                : (type === 'pptx')
                                    ? { backgroundColor: '#FFC107' }
                                    : {}
                        }>{type.toUpperCase()}</CardTypeFile>
                        <CardContent>
                            <Typography variant="subheading" component="h3">{name}</Typography>
                            <CardActions>
                                <Button component="a" href={url} size="small" color="primary">View</Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                </Grid>
            </Grow>
        )
    }
}

export default DocumentCard
