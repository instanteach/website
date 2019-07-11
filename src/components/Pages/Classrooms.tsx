import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";

import IClassroom from "../../interfaces/IClassroom";
import ClassroomService from "../../services/ClassroomService";
import UserService from "../../services/UserService";

interface IState {
	classrooms: IClassroom[];
	forbidden: boolean;
	open: boolean;
	cannotInsert: boolean;
	imageError: string;
	images: object[];
	user: {};
	form: {};
	defaultOpen: boolean;
	thumbnail: string;
}

interface IProps {
	history?: any;
	session?: any;
}

const CardButton = styled(Button)`
	a {
		color: inherit;
		text-decoration: none;
	}
`;
const UnsplashRepository = styled(Grid)`
	height: 100%;
	max-height: 500px;
	overflow-y: overlay;
	& > div {
		position: relative;
		height: 100px;
		margin-bottom: 0.4rem;
	}
`;
const UnsplashImage = styled("img")`
	position: absolute;
	width: calc(100% - 0.4rem);
	height: 100px;
	max-height: 100px;
	cursor: pointer;
`;
const UnsplashImageChecked = styled("div")`
	display: flex;
	position: absolute;
	top: 0.2rem;
	width: calc(100% - 0.4rem);
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	justify-content: center;
	align-items: center;
`;

class Classrooms extends React.Component<IProps, IState> {
	public state = {
		classrooms: [],
		forbidden: false,
		cannotInsert: false,
		form: {
			level: "",
			time: ""
		},
		imageError: "",
		defaultOpen: false,
		images: [
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1549354324-290af3126793?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=michael-prewett-1346961-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=timj-310824-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1531538512164-e6c51ea63d20?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=mimi-thian-737634-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1531674842274-9563aa15686f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=redcharlie-739534-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/flagged/photo-1550946107-8842ae9426db?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=bonneval-sebastien-1389597-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=kimberly-farmer-287677-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=santi-vedri-707620-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1519406596751-0a3ccc4937fe?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=jeffrey-hamilton-571428-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=tim-gouw-69753-unsplash.jpg"
			},
			{
				selected: false,
				url:
					"https://images.unsplash.com/photo-1484820540004-14229fe36ca4?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=markus-spiske-193031-unsplash.jpg"
			}
		],
		open: false,
		thumbnail: "",
		user: {
			avatar: "",
			displayName: "",
			email: "",
			isAdmin: false
		}
	};

	public async componentWillMount() {
		const classrooms: IClassroom[] = await ClassroomService.getByCurrentUser();
		if (classrooms.length === 0) {
			this.setState({
				defaultOpen: true
			});
		}
	}

	public componentDidMount() {
		const { history, session } = this.props;

		if (history.location.pathname.includes("/my-students/user/")) {
			if (!session.isAdmin) {
				this.setState({ forbidden: true });
				return;
			} else {
				(async () => {
					const pathname = history.location.pathname.split("/");
					const userId = pathname[3];
					const classrooms: IClassroom[] = await ClassroomService.getByUserId(
						userId
					);
					const user = await UserService.get(userId);
					this.setState({ classrooms, user: user ? user : {} });
				})();
			}
		} else {
			(async () => {
				const classrooms: IClassroom[] = await ClassroomService.getByCurrentUser();
				this.setState({ classrooms });
			})();
		}
	}

	public removeMsg = () => {
		localStorage.removeItem("popup");
		const classrooms = this.state.classrooms;
		classrooms.shift();
		this.setState({
			cannotInsert: false,
			classrooms
		});
	};

	public handleChange = (field) => (event) => {
		event.preventDefault();
		this.setState({
			...this.state,
			form: {
				...this.state.form,
				[field]: event.target.value
			}
		});
	};

	public removeDefault = () => {
		this.setState({
			defaultOpen: false
		});
	};

	public handleClose = () => {
		this.setState({ open: !this.state.open });
	};

	public setThumbnail = (index) => (event) => {
		const { images } = this.state;
		const imgs: object[] = Array();

		images.map((image, indx) =>
			imgs.push({
				selected: index === indx,
				url: image.url
			})
		);

		this.setState({
			imageError: "",
			images: imgs
		});
	};

	public createClassroom = (event) => {
		(async () => {
			event.preventDefault();
			const { classrooms, images } = this.state;
			const { session } = this.props;
			const image = images.filter((img) => img.selected)[0];

			if (image) {
				let classroom: any;
				const form = event.target;
				const data = {
					age: form.age.value,
					days: form.days.value,
					level: form.level.value,
					name: form.name.value,
					students: form.students.value,
					thumbnail: image.url,
					time: form.time.value,
					userId: session.uid
				};

				const response = await ClassroomService.create(data);

				if (response.error === "") {
					classroom = response.data;
					const arr: IClassroom[] = [classroom, ...classrooms];

					this.setState({ open: false, classrooms: arr, imageError: "" });
				}
				this.setState({
					open: false,
					imageError: "Ups, there was an error 😕"
				});
			} else {
				this.setState({
					imageError: "You have to select an image 🖼"
				});
			}
		})();
	};

	public render() {
		const {
			classrooms,
			defaultOpen,
			forbidden,
			imageError,
			images,
			user
		} = this.state;
		let { cannotInsert, open } = this.state;
		const { history, session } = this.props;
		if (localStorage.getItem("popup") !== null) {
			open = true;
			cannotInsert = true;
		}
		console.log("session", session);
		const mediaQuery = window.matchMedia("(min-width:700px)");

		return (
			<>
				<Grid
					container={true}
					style={{
						minHeight: "75vh",
						flexDirection: "column",
						alignItems: "flex-start"
					}}
				>
					{forbidden ? (
						<Grid item={true}>
							<Typography>You don't have permissions to be here.</Typography>
						</Grid>
					) : (
						<>
							<Grid container={true} item={true} alignItems="center">
								<Grid container={true} item={true} xs={8} md={10}>
									{session.isAdmin &&
									history.location.pathname.includes("/my-students/user/") ? (
										<Typography variant="title">
											Classes' {user.displayName}
										</Typography>
									) : (
										<Typography variant="title">Your Classes</Typography>
									)}
								</Grid>

								{!history.location.pathname.includes("/my-students/user/") ? (
									<Grid
										container={true}
										item={true}
										xs={4}
										md={2}
										justify="flex-end"
									>
										<Button
											variant="raised"
											color="primary"
											fullWidth={true}
											onClick={this.handleClose}
										>
											{mediaQuery.matches ? "New Classroom" : "Add"}
										</Button>
									</Grid>
								) : null}
							</Grid>
							<Grid container={true} spacing={16}>
								{user.email.length > 0 && classrooms.length === 0 ? (
									<>
										<Grid item={true}>
											<br />
											<Typography>There aren't classrooms yet</Typography>
											<br />
											<br />
										</Grid>
									</>
								) : (
									classrooms.map((classroom: any) => (
										<Grid
											container={true}
											item={true}
											sm={4}
											key={classroom.id}
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
										>
											<Grid item={true} xs={12}>
												<Card style={{ width: "100%" }}>
													<CardMedia
														style={{ height: "140px" }}
														title="Image"
														image={classroom.thumbnail}
													/>
													<CardContent>
														<Typography variant="title">
															{classroom.name}
														</Typography>
														<Typography variant="caption">
															{classroom.students} students
														</Typography>
														<Typography variant="caption">
															{classroom.age} years old average age
														</Typography>
													</CardContent>
													<CardActions>
														<Grid container={true} justify="flex-end">
															<CardButton size="small" color="primary">
																<Link to={`/classroom/${classroom.id}`}>
																	View
																</Link>
															</CardButton>
														</Grid>
													</CardActions>
												</Card>
											</Grid>
										</Grid>
									))
								)}
							</Grid>
						</>
					)}
				</Grid>
				<Dialog
					open={open}
					onClose={this.handleClose}
					arial-labelledby="form-dialog-title"
					fullWidth={true}
					fullScreen={!mediaQuery.matches}
				>
					<form onSubmit={this.createClassroom}>
						<DialogTitle id="form-dialog-title">
							Add a new Classroom
						</DialogTitle>
						{classrooms.length >= 10 ? (
							<>
								<DialogContent>
									Class limit is 10. Please delete a class before creating a new
									one
								</DialogContent>
								<DialogActions>
									<Button
										type="button"
										onClick={this.handleClose}
										color="default"
									>
										Ok
									</Button>
								</DialogActions>
							</>
						) : (
							<>
								<DialogContent>
									<DialogContentText style={{ marginBottom: "1rem" }}>
										Please give us some basic information about your students in
										this class and select a picture of your choice. You will be
										able to edit this info later.
									</DialogContentText>
									{imageError ? (
										<Grid item={true} xs={12}>
											<Typography color="error">{imageError}</Typography>
										</Grid>
									) : null}
									<Grid container={true} spacing={16}>
										<Grid
											item={true}
											container={true}
											xs={12}
											md={5}
											alignContent="flex-start"
											id="fields"
										>
											<Grid item={true} xs={12}>
												<TextField
													variant="outlined"
													autoFocus={true}
													margin="normal"
													id="name"
													name="name"
													label="Classroom name"
													type="text"
													fullWidth={true}
													required={true}
												/>
											</Grid>
											<Grid item={true} xs={12}>
												<TextField
													variant="outlined"
													margin="normal"
													id="students"
													name="students"
													label="Number of students"
													type="number"
													fullWidth={true}
													inputProps={{ min: 1 }}
													required={true}
												/>
											</Grid>
											<Grid item={true} xs={12}>
												<TextField
													variant="outlined"
													margin="normal"
													id="age"
													name="age"
													label="Average age"
													type="number"
													fullWidth={true}
													inputProps={{ min: 1 }}
													required={true}
												/>
											</Grid>
											<Grid item={true} xs={12} style={{ marginTop: "1rem" }}>
												<FormControl fullWidth={true}>
													<InputLabel
														htmlFor="level"
														style={{ marginLeft: "1rem" }}
													>
														Classroom Level
													</InputLabel>
													<Select
														required={true}
														fullWidth={true}
														value={this.state.form.level}
														onChange={this.handleChange("level")}
														input={
															<OutlinedInput
																labelWidth={250}
																id="level"
																name="level"
															/>
														}
													>
														<MenuItem value="Elementary">
															Elementary ( learning the alphabet, numbers
															etc...)
														</MenuItem>
														<MenuItem value="Beginner">Beginner</MenuItem>
														<MenuItem value="Pre-intermediate">
															Pre-intermediate
														</MenuItem>
														<MenuItem value="Intermediate">
															Intermediate
														</MenuItem>
														<MenuItem value="Upper-Intermediate">
															Upper-Intermediate
														</MenuItem>
														<MenuItem value="Advanced">Advanced</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item={true} xs={12} style={{ marginTop: "1rem" }}>
												<FormControl fullWidth={true}>
													<InputLabel
														htmlFor="time"
														style={{ marginLeft: "1rem" }}
													>
														Class duration
													</InputLabel>
													<Select
														required={true}
														fullWidth={true}
														value={this.state.form.time}
														onChange={this.handleChange("time")}
														input={
															<OutlinedInput
																labelWidth={250}
																id="time"
																name="time"
															/>
														}
													>
														<MenuItem value="1 hour or less">
															1 hour or less
														</MenuItem>
														<MenuItem value="1.5 hours">1.5 hours</MenuItem>
														<MenuItem value="2 hours">2 hours</MenuItem>
														<MenuItem value="3 hours">3 hours</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item={true} xs={12}>
												<TextField
													variant="outlined"
													margin="normal"
													id="days"
													name="days"
													label="Times per week"
													type="number"
													inputProps={{ min: 1 }}
													fullWidth={true}
													required={true}
												/>
											</Grid>
										</Grid>
										<UnsplashRepository
											item={true}
											container={true}
											spacing={8}
											xs={12}
											md={7}
											id="images"
										>
											{images.map((image, index) => (
												<Grid key={index} item={true} xs={6}>
													<UnsplashImage
														src={image.url}
														onClick={this.setThumbnail(index)}
													/>
													{image.selected ? (
														<UnsplashImageChecked>
															<CheckOutlinedIcon />
														</UnsplashImageChecked>
													) : null}
												</Grid>
											))}
										</UnsplashRepository>
									</Grid>
								</DialogContent>
								<DialogActions>
									<Button
										type="button"
										onClick={this.handleClose}
										color="default"
									>
										Cancel
									</Button>
									<Button type="submit" color="primary">
										Add
									</Button>
								</DialogActions>
							</>
						)}
					</form>
				</Dialog>
				<Dialog
					open={cannotInsert}
					onClose={this.removeMsg}
					arial-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">
						Cannot Add This Classroom
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{"A classrom with similiar specifications already exists" +
								"Please try again"}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button type="button" color="primary" onClick={this.removeMsg}>
							OK
						</Button>
					</DialogActions>
				</Dialog>
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
			</>
		);
	}
}

export default Classrooms;
