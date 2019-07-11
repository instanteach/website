import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {
	Button,
	FormControl,
	FormGroup,
	Grid,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
	Typography
} from "@material-ui/core";

import MaterialGeneratorStep from "../MaterialGeneratorStep";
import MaterialLevelSelector from "../MaterialLevelSelector";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import IClassroom from "../../interfaces/IClassroom";
import ClassroomService from "../../services/ClassroomService";
import MaterialService from "../../services/MaterialService";

interface IState {
	classrooms: IClassroom[];
	error: string;
	ready: boolean;
	request: any;
	step: number;
	defaultOpen: boolean;
	steps: number;
	success: boolean;
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

interface IProps {
	history?: any;
	session?: any;
}

const FormUI = styled("form")`
	display: flex;
	width: 100%;
	flex-flow: row wrap;
	justify-content: center;
`;
const Generator = styled(Grid)`
	margin-top: 3rem !important;
	@media screen and (min-width: 700px) {
		margin-top: 7rem !important;
	}
`;
const SuccessContainer = styled(Grid)`
	height: 500px;
`;
const Success = styled("div")`
	margin-bottom: 1rem;
	width: 100%;
	border-radius: 8px;
	padding: 2rem;
	background-color: var(--primary-color);
	color: white;
	font-size: 1.2rem;
`;
const CustomLink = styled(Link)`
	text-decoration: none;
	color: inhertir;
`;

/*
<TellForm id="iframe" src="https://instanteach.typeform.com/to/DGwwuX">
	Loading..
</TellForm>
*/

class MaterialGenerator extends React.PureComponent<IProps, IState> {
	public state = {
		classrooms: [],
		error: "",
		ready: false,
		defaultOpen: false,
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
	};

	public async componentDidMount() {
		const classrooms: IClassroom[] = await ClassroomService.getByCurrentUser();

		this.setState({ classrooms, ready: true });
	}

	public async componentWillMount() {
		const classrooms: IClassroom[] = await ClassroomService.getByCurrentUser();
		if (classrooms.length === 0) {
			this.setState({
				defaultOpen: true
			});
		}
	}

	public handleChange = (field) => (event) => {
		event.preventDefault();
		const { step, steps } = this.state;
		if (event.target.value !== "") {
			this.setState({
				...this.state,
				error: "",
				request: {
					...this.state.request,
					[field]: event.target.value
				},
				step: step >= steps ? steps : step + 1
			});
		}
	};

	public handleChangeTextField = (field) => (event) => {
		event.preventDefault();
		this.setState({
			...this.state,
			error: "",
			request: {
				...this.state.request,
				[field]: event.target.value
			}
		});
	};

	public handleKeyPress = (event) => {
		if (event.charCode === 13) {
			this.next();
		}
	};

	public removeDefault = () => {
		this.setState({
			defaultOpen: false
		});
	};

	public next = () => {
		const { step, steps } = this.state;
		this.setState({
			error: "",
			step: step >= steps ? steps : step + 1
		});
	};

	public prev = () => {
		const { step } = this.state;
		this.setState({
			error: "",
			step: step > 0 ? step - 1 : 0
		});
	};

	public reset = () => {
		this.setState({
			error: "",
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
		});
	};

	public submit = (event) => {
		event.preventDefault();
		const { step, steps } = this.state;
		if (step >= steps) {
			(async () => {
				const { request } = this.state;
				const response = await MaterialService.request(request);
				console.log(response);
				if (response.ok) {
					await MaterialService.submitOnGoogleSpreadsheet(request);
					this.setState({
						success: true
					});
				} else {
					this.reset();
					this.setState({ error: response.error });
				}
			})();
		}
	};

	public render() {
		const {
			classrooms,
			defaultOpen,
			error,
			ready,
			request,
			step,
			success
		} = this.state;
		const { session } = this.props;
		return success ? (
			<SuccessContainer
				container={true}
				spacing={16}
				justify="center"
				alignItems="center"
			>
				<Grid container={true} item={true} xs={12} md={6} justify="flex-end">
					<Success>
						We have successfully received your material request . Within the
						next 24 hours, we will assign material to your classroom and notify
						you by email. Stay tuned! 😁
					</Success>
					<Button variant="text" onClick={this.reset}>
						Request Another
					</Button>
				</Grid>
			</SuccessContainer>
		) : (
			<Grid container={true} spacing={16}>
				<Grid item={true} xs={12}>
					<Typography variant="title">
						After completing this form, you will receive the material for your
						class in less than 24 hours. Thank you!
					</Typography>
				</Grid>
				<Generator item={true} xs={12}>
					<FormUI onSubmit={this.submit}>
						<Grid container={true} item={true} spacing={24} xs={12} md={6}>
							<MaterialGeneratorStep hidden={step !== 0}>
								<FormControl fullWidth={true}>
									<InputLabel htmlFor="cc" style={{ marginLeft: "1rem" }}>
										Select a Classroom
									</InputLabel>
									<Select
										required={true}
										fullWidth={true}
										value={request.classroom}
										disabled={classrooms.length === 0}
										onChange={this.handleChange("classroom")}
										input={
											<OutlinedInput
												labelWidth={150}
												id="cc"
												name="classroom"
											/>
										}
									>
										<MenuItem value="">
											<em>Select a classroom</em>
										</MenuItem>
										{classrooms.map((classroom: IClassroom) => (
											<MenuItem key={classroom.id} value={classroom.id}>
												{classroom.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 1} prev={this.prev}>
								<FormControl fullWidth={true}>
									<InputLabel htmlFor="type" style={{ marginLeft: "1rem" }}>
										What type of material to you need?
									</InputLabel>
									<Select
										required={true}
										fullWidth={true}
										value={request.type}
										onChange={this.handleChange("type")}
										input={
											<OutlinedInput labelWidth={250} id="type" name="type" />
										}
									>
										<MenuItem value="">
											<em>Select a type</em>
										</MenuItem>
										<MenuItem value="Lesson Plans">
											Lesson Plans (Activities with no instructions)
										</MenuItem>
										<MenuItem value="Worksheets">
											Worksheets ( No Instructions)
										</MenuItem>
										<MenuItem value="Surprise me!">
											Surprise me! (we'll figure it out for you 😉🎲)
										</MenuItem>
									</Select>
								</FormControl>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep
								skippable={true}
								onClick={this.next}
								hidden={step !== 2}
								prev={this.prev}
							>
								<FormGroup>
									<InputLabel>
										Do you know what topic you want to teach? If you don´t, just
										leave this field empty 😄
									</InputLabel>
									<TextField
										variant="outlined"
										name="topic"
										label="Topic"
										value={request.topic}
										fullWidth={true}
										onKeyPress={this.handleKeyPress}
										onChange={this.handleChangeTextField("topic")}
									/>
								</FormGroup>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 3} prev={this.prev}>
								<MaterialLevelSelector
									name="speaking"
									value={request.speaking}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Speaking?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 4} prev={this.prev}>
								<MaterialLevelSelector
									name="writing"
									value={request.writing}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Writing?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 5} prev={this.prev}>
								<MaterialLevelSelector
									name="listening"
									value={request.listening}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Listening?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 6} prev={this.prev}>
								<MaterialLevelSelector
									name="reading"
									value={request.reading}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Reading?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 7} prev={this.prev}>
								<MaterialLevelSelector
									name="grammar"
									value={request.grammar}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Grammar?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 8} prev={this.prev}>
								<MaterialLevelSelector
									name="vocabulary"
									value={request.vocabulary}
									onChange={this.handleChange}
									required={true}
									label="In the last class, How well did your student(s) do in Vocabulary?"
								/>
							</MaterialGeneratorStep>
							<MaterialGeneratorStep hidden={step !== 8}>
								<FormGroup>
									<Button
										variant="raised"
										size="large"
										color="primary"
										type="submit"
										fullWidth={true}
									>
										<Typography
											variant="display1"
											style={{ color: "var(--secondary-color)" }}
										>
											Generate Material
										</Typography>
									</Button>
								</FormGroup>
							</MaterialGeneratorStep>
						</Grid>
						{error.length > 0 ? (
							<Grid
								container={true}
								item={true}
								xs={12}
								style={{ marginTop: "1rem" }}
								justify="center"
							>
								<Typography>{error}</Typography>
							</Grid>
						) : null}
					</FormUI>
					{ready && classrooms.length === 0 ? (
						<>
							<Grid
								container={true}
								item={true}
								xs={12}
								justify="center"
								style={{ marginTop: "1rem" }}
							>
								<Typography>
									You have to create a class group first, before request a
									material
								</Typography>
							</Grid>
							<Grid
								container={true}
								item={true}
								xs={12}
								justify="center"
								style={{ marginTop: "1rem" }}
							>
								<CustomLink to="/my-students">
									<Button variant="raised" color="primary">
										My Students
									</Button>
								</CustomLink>
							</Grid>
						</>
					) : null}
				</Generator>
				<Dialog
					open={defaultOpen}
					onClose={this.removeDefault}
					arial-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Create Classroom</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<p>Hello {session.displayName},</p>
							<p>
								Us teachers are working hard. Everyday we are looking for the
								best material to teach our students. Wouldn’t it be great - and
								save a lot of time - if there was a helpful tool to give us the
								right material?
							</p>
							<p>Welcome to Instanteach! 🤗</p>
							<p>But wait, what is Instanteach?? 🤔</p>
							<p>
								Instanteach is your new material assistant for your classes. We
								will give you personalized material for your students based on
								their characteristics and abilities...
							</p>
							<p>
								<strong>
									<ul>
										<li>
											No more searching for a worksheet for hours and hours!
										</li>
										<li>
											No more having to improvise a class because you didn't
											have time to find a good lesson plan!
										</li>
									</ul>
								</strong>
							</p>
							<p>And of course it's all 100% free :) 🤩</p>
							<p>
								So get started! Create your first class, give us some basic
								information about those students 👨‍🎓👩‍🎓👨‍🎓👩‍🎓 (you´ll need to fill
								this out only once but you can edit it later) and then…… Request
								some material! We´ll send you the ideal classroom material for
								you and and your students so that you only need to worry on the
								thing that matters most: Teaching an engaging class :) 👨‍🏫👩‍🏫
							</p>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button type="button" color="primary" onClick={this.removeDefault}>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		);
	}
}

export default MaterialGenerator;
