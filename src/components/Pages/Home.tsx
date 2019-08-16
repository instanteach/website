import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import BackgroundSVG from '../../assets/images/landing/background.svg'
import FolderSVG from '../../assets/images/landing/folders.svg'
import LettersPNG from '../../assets/images/landing/letters.png'
import RobotSVG from '../../assets/images/landing/robot.svg'

const Wrapper = styled('div')`
  padding-bottom: 50px;
  h1, h2, h3 {
    padding-bottom: 15px;
  }
  p {
    padding-bottom: 5px;
  }
`
const HomeOption = styled(Link)`
	display: flex;
	width: 100%;
	height: 220px;
	border: 1px solid #ccc;
	border-radius: 8px;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	text-decoration: none;
	&:hover {
		transition-duration: .5s;
		background-color: var(--primary-color);
		* {
			color: var(--secondary-color);
		}
	}
	img {
		width: 100px;
		margin-right: 2rem;
		&.folder-svg {
			width: 70px;
		}
		&.robot-svg {
			position: relative;
			bottom: .5rem;
		}
		&.background-svg {
			margin-right: 1.7rem;
		}
 	}
	p {
		text-transform: uppercase;
		color: var(--primary-color);
		font-weight: bold;
		font-size: 1.6rem;
	}
`

const Home = () => (
	<Wrapper>
		<Grid container={true} spacing={32} justify="center">
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/my-students">
					<img src={BackgroundSVG} className="background-svg" />
					<Typography>My Students</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/material-generator">
					<img src={RobotSVG} className="robot-svg" />
					<Typography>Material Generator</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/lesson-plans">
					<img src={FolderSVG} className="folder-svg" />
					<Typography>Lesson Plans</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/contact">
					<img src={LettersPNG} />
					<Typography>Contact us</Typography>
				</HomeOption>
			</Grid>
		</Grid>
	</Wrapper>
)

export default Home
