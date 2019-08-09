import * as firebase from 'firebase'
import * as React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import {Button, FormControl, FormGroup, Grid, InputLabel, MenuItem, OutlinedInput,
				Select, TextField, Typography} from "@material-ui/core"

import MaterialGeneratorStep from "../MaterialGeneratorStep"
import MaterialLevelSelector from "../MaterialLevelSelector"

import IClassroom from "../../interfaces/IClassroom"
import ClassroomService from "../../services/ClassroomService"
import MaterialService from "../../services/MaterialService"

interface IState {
	classrooms: IClassroom[]
	error: string
	is_disabled: boolean
	is_submitted: boolean
	ready: boolean
	request: any
	step: number
	steps: number
	success: boolean
}

/*
const TellForm = styled('iframe')`
  border: none;
  padding-bottom: 20px;
	width: 100%;
	height: 500px;
  max-height: 90%
`
*/

const FormUI = styled('form')`
	display: flex;
	width: 100%;
	flex-flow: row wrap;
	justify-content: center;
`
const Generator = styled(Grid)`
	margin-top: 3rem !important;
	@media screen and (min-width: 700px) {
		margin-top: 7rem !important;
	}
`
const SuccessContainer = styled(Grid)`
	height: 500px;
`
const Success = styled('div')`
	margin-bottom: 1rem;
	width: 100%;
	border-radius: 8px;
	padding: 2rem;
	background-color: var(--primary-color);
	color: white;
	font-size: 1.2rem;
`
const CustomLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`

const LinkButton = styled(Link)`
  text-decoration: none
`

/*
<TellForm id="iframe" src="https://instanteach.typeform.com/to/DGwwuX">
	Loading..
</TellForm>
*/

class MaterialGenerator extends React.PureComponent<{}, IState> {
	public state = {
		classrooms: [],
		error: "",
		is_disabled: false,
		is_submitted: false,
		ready: false,
		request: {
			classroom: "",
			grammar: "",
			listening: "",
			reading: "",
			speaking: "",
			topic: "",
			type: "",
			vocabulary: "",
			writing: ""
		},
		step: 0,
		steps: 8,
		success: false
	}

	public async componentDidMount() {
		firebase.auth().onAuthStateChanged(u => {
			if(u) {
				(async () => {
					const response: any = await ClassroomService.getByCurrentUser();
					if(response.ok) {
						const classrooms: IClassroom[] = response.data
						this.setState({classrooms, ready: true})
					}
				})();
			}
		})
	}

	public handleChange = field => event => {
		event.preventDefault()
		const {step, steps} = this.state
		if(event.target.value !== "") {
			this.setState({
				...this.state,
				error: "",
				request: {
					...this.state.request,
					[field]: event.target.value,
				},
				step: step >= steps ? steps : step + 1
			})
		}
	}

	public handleChangeTextField = field => event => {
		event.preventDefault()
		this.setState({
			...this.state,
			error: "",
			request: {
				...this.state.request,
				[field]: event.target.value,
			}
		})
	}

	public handleKeyPress = event => {
		if(event.charCode === 13) {
			this.next()
		}
	}

	public next = () => {
		const {step, steps} = this.state
		this.setState({
			error: "",
			step: step >= steps ? steps : step+1
		})
	}

	public prev = () => {
		const {step} = this.state
		this.setState({
			error: "",
			step: step > 0 ? step-1 : 0
		})
	}

	public reset =() => {
		this.setState({
			error: "",
			is_disabled: false,
			is_submitted: false,
			request: {
				classroom: "",
				grammar: "",
				listening: "",
				reading: "",
				speaking: "",
				topic: "",
				type: "",
				vocabulary: "",
				writing: ""
			},
			step: 0,
			success: false
		})
	}
	
	public submit = event => {
		event.preventDefault()
		this.disableSubmit()

		const {is_submitted, step, steps} = this.state
		
		if(step >= steps && !is_submitted) {
			(async () => {
				const {request} = this.state
				const response  = await MaterialService.request(request)
				if(response.ok) {
					await MaterialService.submitOnGoogleSpreadsheet(request)
					this.setState({
						is_submitted: true,
						success: true
					})
				} else {
					this.reset()
					this.setState({ error: response.error })
				}
			})()
		}
	}

	public disableSubmit = () => {
		this.setState({is_disabled: true})
	}

  public render() {
		const {classrooms, error, is_disabled, ready, request, step, success} = this.state
    return (
			success
			? (
				<SuccessContainer container={true} spacing={16} justify="center" alignItems="center">
					<Grid container={true} item={true} xs={12} md={6} justify="flex-end">
						<Success>We have successfully received your material request . Within the next 24 hours, we will assign material to your classroom and notify you by email. Stay tuned! 😁</Success>
						<LinkButton to="/my-students"><Button variant="text" onClick={this.reset}>Go back to My Students</Button></LinkButton>
						<Button variant="text" onClick={this.reset}>Request Another</Button>
					</Grid>
				</SuccessContainer>
			)
			: (
				<Grid container={true} spacing={16}>
					<Grid item={true} xs={12}>
						<Typography variant="title">After completing this form, you will receive the material for your class in less than 24 hours. Thank you!</Typography>
					</Grid>
					<Generator item={true} xs={12}>
						<FormUI onSubmit={this.submit}>
							<Grid container={true} item={true} spacing={24} xs={12} md={6}>
								<MaterialGeneratorStep hidden={step !== 0}>
									<FormControl fullWidth={true}>
										<InputLabel htmlFor="cc" style={{marginLeft: '1rem'}}>Select a Classroom</InputLabel>
										<Select
											required={true}
											fullWidth={true}
											value={request.classroom}
											disabled={classrooms.length === 0}
											onChange={this.handleChange('classroom')}
											input={
												<OutlinedInput
													labelWidth={150}
													id="cc"
													name="classroom" />
											}>
											<MenuItem value=""><em>Select a classroom</em></MenuItem>
											{
											classrooms.map((classroom: IClassroom) => (
												<MenuItem key={classroom.id} value={classroom.id}>{classroom.name}</MenuItem>
											))
											}
										</Select>
									</FormControl>
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 1} prev={this.prev}>
									<FormControl fullWidth={true}>
										<InputLabel htmlFor="type" style={{marginLeft: '1rem'}}>What type of material to you need?</InputLabel>
										<Select
											required={true}
											fullWidth={true}
											value={request.type}
											onChange={this.handleChange('type')}
											input={
												<OutlinedInput
													labelWidth={250}
													id="type"
													name="type" />
											}>
											<MenuItem value=""><em>Select a type</em></MenuItem>
											<MenuItem value="Lesson Plans">Lesson Plans (Activities with no instructions)</MenuItem>
											<MenuItem value="Worksheets">Worksheets ( No Instructions)</MenuItem>
											<MenuItem value="Surprise me!">Surprise me! (we'll figure it out for you 😉🎲)</MenuItem>
										</Select>
									</FormControl>
								</MaterialGeneratorStep>
								<MaterialGeneratorStep skippable={true} onClick={this.next} hidden={step !== 2} prev={this.prev}>
									<FormGroup>
										<InputLabel>Do you know what topic you want to teach? If you don´t, just leave this field empty 😄</InputLabel>
										<TextField
											variant="outlined"
											name="topic"
											label="Topic"
											value={request.topic}
											fullWidth={true}
											onKeyPress={this.handleKeyPress}
											onChange={this.handleChangeTextField('topic')} />
									</FormGroup>
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 3} prev={this.prev}>
									<MaterialLevelSelector
										name="speaking"
										value={request.speaking}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Speaking?" />
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 4} prev={this.prev}>
									<MaterialLevelSelector
										name="writing"
										value={request.writing}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Writing?" />
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 5} prev={this.prev}>
									<MaterialLevelSelector
										name="listening"
										value={request.listening}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Listening?" />
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 6} prev={this.prev}>
									<MaterialLevelSelector
										name="reading"
										value={request.reading}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Reading?" />
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 7} prev={this.prev}>
									<MaterialLevelSelector
										name="grammar"
										value={request.grammar}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Grammar?" />
									</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 8} prev={this.prev}>
									<MaterialLevelSelector
										name="vocabulary"
										value={request.vocabulary}
										onChange={this.handleChange}
										required={true}
										label="In the last class, How well did your student(s) do in Vocabulary?" />
								</MaterialGeneratorStep>
								<MaterialGeneratorStep hidden={step !== 8}>
									<FormGroup>
										<Button disabled={request.vocabulary === "" || is_disabled} variant="raised" size="large" color="primary" type="submit" fullWidth={true}>
											<Typography variant="display1" style={{color:'var(--secondary-color)'}}>
												Generate Material
											</Typography>
										</Button>
									</FormGroup>
								</MaterialGeneratorStep>
							</Grid>
							{
								error.length > 0
								? (
									<Grid container={true} item={true} xs={12} style={{ marginTop: '1rem' }} justify="center">
										<Typography>{error}</Typography>
									</Grid>
								)
								: null
							}
						</FormUI>
						{
						ready && classrooms.length === 0
						? (
							<>
							<Grid container={true} item={true} xs={12} justify="center" style={{marginTop: '1rem'}}>
								<Typography>You have to create a class group first, before request a material</Typography>
							</Grid>
							<Grid container={true} item={true} xs={12} justify="center" style={{marginTop: '1rem'}}>
								<CustomLink to="/my-students"><Button variant="raised" color="primary">My Students</Button></CustomLink>
							</Grid>
							</>
						) : null
						}
					</Generator>
				</Grid>
			)
    )
  }
}

export default MaterialGenerator;