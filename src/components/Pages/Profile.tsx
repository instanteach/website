import { Button, FormGroup, Grid, TextField } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import store from "../../state/store";

import IUser from "../../interfaces/IUser";
import UserService from "../../services/UserService";
import { setUserData } from "../../state/creator";

interface IState {
	user: IUser | any;
	displayName: string;
	email: string;
	password: string;
	success: boolean;
}

const FormUI = styled("form")`
	width: 100%;
`;

const Message = styled("p")`
	color: var(--primary-color);
`;

class Profile extends React.PureComponent<{}, IState> {
	public state = {
		displayName: "",
		email: "",
		password: "",
		success: false,
		user: null
	};

	public componentDidMount() {
		if (store.getState().user != null) {
			this.setState({
				displayName: store.getState().user.displayName,
				email: store.getState().user.email,
				user: store.getState().user
			});
		}
	}

	public handleForm = (arg) => (event) => {
		event.preventDefault();
		this.setState({
			...this.state,
			[arg]: event.target.value,
			success: false
		});
	};

	public submit = (event) => {
		(async () => {
			event.preventDefault();
			const { displayName, email, password } = this.state;
			const data = {
				displayName,
				email,
				password
			};
			const response = await UserService.update(data);
			if (response.error === "") {
				await store.dispatch(setUserData(response.user));
				this.setState({ success: true });
			}
		})();
	};

	public render() {
		const { user, displayName, email, password, success } = this.state;
		return user ? (
			<Grid container={true}>
				<FormUI onSubmit={this.submit}>
					<Grid item={true} xs={12}>
						{success ? (
							<Message>
								Congratulations, you have updated your basic user information
								successfully! 🎉
							</Message>
						) : null}
					</Grid>
					<Grid item={true} container={true} spacing={16} xs={12} md={6}>
						<Grid item={true} xs={12}>
							<FormGroup>
								<TextField
									variant="outlined"
									value={displayName}
									label="Full Name"
									fullWidth={true}
									onChange={this.handleForm("displayName")}
								/>
							</FormGroup>
						</Grid>
						<Grid item={true} xs={12}>
							<FormGroup>
								<TextField
									variant="outlined"
									value={email}
									label="E-mail"
									fullWidth={true}
									onChange={this.handleForm("email")}
								/>
							</FormGroup>
						</Grid>
						<Grid item={true} xs={12}>
							<FormGroup>
								<TextField
									variant="outlined"
									value={password}
									label="Password"
									type="password"
									fullWidth={true}
									onChange={this.handleForm("password")}
								/>
							</FormGroup>
						</Grid>
						<Grid item={true} xs={12} justify="flex-end">
							<Button variant="contained" color="primary" type="submit">
								Update
							</Button>
						</Grid>
					</Grid>
				</FormUI>
			</Grid>
		) : null;
	}
}

export default Profile;
