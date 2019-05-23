import * as React from 'react'
import {Line} from 'react-chartjs-2'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IClassroom from '../interfaces/IClassroom';
import MaterialService from '../services/MaterialService'

interface IProps {
	classroom:IClassroom
	isOpen: boolean
}

interface IState {
	skills:object[]
	labels:string[]
}

const LineWrapper = styled('div')`
	min-height: 60vh;
	@media screen and (min-width:700px) {
		min-width: 100%;
		min-height: auto;
	}
`

const commonProperties = {
	borderCapStyle: 'butt',
	borderDash: [],
	borderDashOffset: 0.0,
	borderJoinStyle: 'miter',
	fill: false,
	lineTension: 0.1,
	pointBackgroundColor: '#fff',
	pointBorderWidth: 1,
	pointHitRadius: 10,
	pointHoverBorderColor: 'rgba(220,220,220,1)',
	pointHoverBorderWidth: 2,
	pointHoverRadius: 5,
	pointRadius: 1
}

const colors = [
	{
		primary: 'rgba(38, 72, 186, 1)',
		secondary: 'rgba(38, 72, 186, 0.4)'
	},
	{
		primary: 'rgba(249, 227, 22, 1)',
		secondary: 'rgba(249, 227, 22, 0.4)'
	},
	{
		
		primary: 'rgba(244, 67, 54, 1)',
		secondary: 'rgba(244, 67, 54, 0.4)'
	},
	{
		primary: 'rgba(76, 175, 80, 1)',
		secondary: 'rgba(76, 175, 80, 0.4)'
	},
	{
		primary: 'rgba(156, 39, 176, 1)',
		secondary: 'rgba(156, 39, 176, 0.4)'
	},
	{
		primary: 'rgba(3, 169, 244, 1)',
		secondary: 'rgba(3, 169, 244, 0.4)'
	},
	{
		primary: 'rgba(255, 152, 0, 1)',
		secondary: 'rgba(255, 152, 0, 0.4)'
	}
]

class Graphics extends React.PureComponent<IProps, IState> {
	public state = {
		labels: [],
		skills: []
	}

	public async componentDidMount() {
		const {classroom} = this.props
		const labels:string[] = []
		const general:number[] = []
		const grammar:number[] = []
		const listening:number[] = []
		const reading:number[] = []
		const speaking:number[] = []
		const vocabulary:number[] = []
		const writing:number[] = []
		const response = await MaterialService.analytics(classroom.id)
		
		if(response.ok) {
			const d = response.data
			console.log(d)
			d.map((doc:any) => {
				labels.push(doc.createdAt)
				general.push(doc.general)
				grammar.push(doc.grammar)
				listening.push(doc.listening)
				reading.push(doc.reading)
				speaking.push(doc.speaking)
				vocabulary.push(doc.vocabulary)
				writing.push(doc.writing)
			})
			
			this.setState({
				labels,
				skills: [
					{
						colors: colors[0],
						label: "General",
						values: general
					},
					{
						colors: colors[1],
						label: "Grammar",
						values: grammar
					},
					{
						colors: colors[2],
						label: "Listening",
						values: listening
					},
					{
						colors: colors[3],
						label: "Reading",
						values: reading
					},
					{
						colors: colors[4],
						label: "Speaking",
						values: speaking
					},
					{
						colors: colors[5],
						label: "Vocabulary",
						values: vocabulary
					},
					{
						colors: colors[6],
						label: "Writing",
						values: writing
					}
				]
			})
		}
		else {
			console.log(response.error)
		}
	}

	public render() {
		const {skills, labels} = this.state
		const {isOpen, classroom} = this.props
		const datasets:any = []
		const mediaQuery = window.matchMedia("(min-width:700px)")

		skills.map((skill:any) => {
			datasets.push({
				...commonProperties,
					backgroundColor: skill.colors.secondary,
					borderColor: skill.colors.primary,
					data: skill.values,
					hidden: skill.label === "General" ? false: true,
					label: skill.label,
					pointBorderColor: skill.colors.primary,
					pointHoverBackgroundColor: skill.colors.secondary
			})
		})

		const data = {
			datasets,
			labels,
		};

		const legend = {
			labels: {
				padding: mediaQuery.matches ? 40 : 20
			},
			position: mediaQuery.matches ? "right" : "bottom"
		}

		const options={
			maintainAspectRatio: mediaQuery.matches ? true : false
		}

		return (
			isOpen
			? (
				<Grid container={true} item={true} xs={12} justify="center" className="animated fadeIn" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
					{
					data.datasets.length >= 3
					? (
						<>
						<Grid item={true} xs={12} md={11}>
							<Typography variant="title">This graph monitors the progress of students in {classroom.name}</Typography>
						</Grid>
						<Grid item={true} xs={12} md={1}>
							<Typography><small>Select which abilities you wish to graph</small></Typography>
						</Grid>
						<LineWrapper>
							<Line data={data} options={options} legend={legend} />
						</LineWrapper>
						</>
					)
					: <Typography>We will start showing you student´s progress afer you´ve have entered their ability levels more than 2 times</Typography>
					}
				</Grid>
			) : null
		)
	}
}

export default Graphics