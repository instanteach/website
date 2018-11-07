import * as React from 'react'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'
import Grow from '@material-ui/core/Grow'

interface IProps {
    clicked: boolean
    name: string
    onClick: any
}

const FolderUI = styled('div')`
    position: relative;
    display: flex;
    flex: 1;
    margin: 1rem 2rem;
    padding: 1rem;
    max-width: 150px;
    height: 80px;
    border: 1px solid #C0C0C0;
    border-radius: 4px;
    background-color: #CCCCCC;
    justify-content: center;
    align-items: center;
    transform: skewx(10deg);
    transition-duration: .3s;
    cursor: pointer;
    &:before {
        content: '';
        position: absolute;
        bottom: -1px;
        right: -10px;
        width: 100%;
        height: 115%;
        background-color: #EAEAEA;
        border-radius: 4px;
        border: 1px solid #DDD;
        transform: skewx(-10deg);
    }
    &:after {
        content: '';
        position: absolute;
        top: -15px;
        right: -18px;
        width: 40px;
        height: 8px;
        border-radius: 4px 4px 0 0;
        border: 1px solid #DDD;
        border-bottom-color: #EAEAEA;
        background-color: #EAEAEA;
        transform: skew(-10deg);
    }
    &:hover {
        background-color: #BBBBBB;
        &:before,
        &:after {
            background-color: #F0F0F0;
        }
        &:after {
            border-bottom-color: transparent;
        }
    }
`

const FolderTitle = styled('p')`
    position: relative;
    z-index: 2;
    left: .5rem;
    bottom: .2rem;
    font-size: 1rem;
    font-weight: 600;
    color: #666;
    transform: skewx(-10deg);
`

const Folder = (props: IProps) => (
    <Grow in={props.clicked}>
        <Grid item={true} xs={3}>
            <FolderUI onClick={props.onClick.bind(props, props.name)}>
                <FolderTitle>{props.name.replace(/\b\w/g, letter => letter.toUpperCase())}</FolderTitle>
            </FolderUI>
        </Grid>
    </Grow>
)

export default Folder