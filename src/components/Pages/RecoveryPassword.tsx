import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import store from "../../state/store";

import AuthenticationService from "../../services/AuthenticationService";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

interface IState {
	auth: boolean;
	error: boolean;
	ready: boolean;
	session: any;
}

const CustomLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

const gridStyles = {
	marginTop: "4rem",
	minHeight: "90%"
};

const inputStyles = {
	marginBottom: "1rem",
	width: "100%"
};

class RecoveryPassword extends React.PureComponent<{}, IState> {
	public state = {
		auth: false,
		email: "",
		error: false,
		ready: false,
		session: null
	};

	public unsubscribe: any;

	public componentWillMount() {
		// Verify if exists an user session
		AuthenticationService.listener();
	}

	public submit = (event) => {
		(async () => {
			event.preventDefault();
			if (event.target != null) {
				const response = await AuthenticationService.recoveryPassword(
					event.target.email.value
				);
				if (response.ok) {
					this.setState({ ready: true });
				}
			}
		})();
	};

	public componentDidMount() {
		const { session } = this.state;
		this.unsubscribe = store.subscribe(() => {
			const s = store.getState().session;
			if (s && s !== session) {
				this.setState({ session: s });
			}
		});
	}

	public componentWillUnmount() {
		this.unsubscribe();
	}

	public render() {
		const { auth, ready, session } = this.state;

		return session || auth ? (
			<Redirect to="/my-students" />
		) : (
			<Grid
				container={true}
				spacing={16}
				style={gridStyles}
				direction="row"
				justify="center"
				alignItems="center"
			>
				{ready ? (
					<>
						<Grid item={true} container={true} xs={12} md={8} justify="center">
							<Typography variant="headline">
								We have sent you an email to recover your password 😉
							</Typography>
						</Grid>
						<Grid item={true} container={true} xs={12} md={8} justify="center">
							<CustomLink to="/login">
								<Button size="medium" variant="raised" color="primary">
									Login
								</Button>
							</CustomLink>
						</Grid>
					</>
				) : (
					<Grid item={true} xs={12} md={4}>
						<form onSubmit={this.submit}>
							<Grid item={true} xs={12}>
								<TextField
									label="E-mail"
									name="email"
									type="email"
									variant="outlined"
									disabled={ready}
									style={inputStyles}
								/>
							</Grid>
							<Grid item={true} container={true} xs={12}>
								<Button
									fullWidth={true}
									size="large"
									variant="contained"
									color="primary"
									type="submit"
									disabled={ready}
									style={{ marginBottom: "1rem" }}
								>
									Recovery Password
								</Button>
							</Grid>
						</form>
					</Grid>
				)}
			</Grid>
		);
	}
}

export default RecoveryPassword;
