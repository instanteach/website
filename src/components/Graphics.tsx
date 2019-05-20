import * as React from 'react'
import {Line} from 'react-chartjs-2'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import MaterialService from '../services/MaterialService'

interface IProps {
	classroomId: string
	isOpen: boolean
}

interface IState {
	skills:object[]
	labels:string[]
}

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
		const {classroomId} = this.props
		const labels:string[] = []
		const general:number[] = []
		const grammar:number[] = []
		const listening:number[] = []
		const reading:number[] = []
		const speaking:number[] = []
		const vocabulary:number[] = []
		const writing:number[] = []
		const response = await MaterialService.analytics(classroomId)
		
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
		const {isOpen} = this.props
		const datasets:any = []

		skills.map((skill:any) => {
			datasets.push({
				...commonProperties,
					backgroundColor: skill.colors.secondary,
					borderColor: skill.colors.primary,
					data: skill.values,
					label: skill.label,
					pointBorderColor: skill.colors.primary,
					pointHoverBackgroundColor: skill.colors.secondary
			})
		})

		const data = {
			datasets,
			labels,
		};
		return (
			isOpen
			? (
				<Grid container={true} item={true} xs={12} className="animated fadeIn" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
					<Divider />
					<Line data={data} legend={{ position:"right", labels: { padding: 40 } }}  />
				</Grid>
			) : null
		)
	}
}

export default Graphics