import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

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
`

const Home = () => (
	<Wrapper>
		<Grid container={true} spacing={32} justify="center">
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/my-students">
					<Typography variant="display2" align="center">My Students</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/material-generator">
					<Typography variant="display2" align="center">Material Generator</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/lesson-plans">
					<Typography variant="display2" align="center">Lesson Plans</Typography>
				</HomeOption>
			</Grid>
			<Grid container={true} item={true} xs={12} md={6} justify="center" alignContent="center" spacing={16}>
				<HomeOption to="/contact">
					<Typography variant="display2" align="center">Contact us</Typography>
				</HomeOption>
			</Grid>
		</Grid>
	</Wrapper>
)

export default Home
