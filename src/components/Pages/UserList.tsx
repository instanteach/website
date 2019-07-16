import { Button, Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import IUser from "../../interfaces/IUser";
import UserService from "../../services/UserService";
import Avatar from "../Avatar";
import Search from "../Search";

interface IState {
	users: any;
	filter: string;
}

const LinkButton = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

class UserList extends React.PureComponent<{}, IState> {
	public state = {
		filter: "",
		users: []
	};

	public componentDidMount() {
		(async () => {
			this.setState({ users: await UserService.getAllUsers() });
		})();
	}

	public search = (e) => {
		e.preventDefault();
		this.setState({ filter: e.target.value });
	};

	public render() {
		const { users, filter } = this.state;

		const card = (user) => (
			<Grid
				container={true}
				item={true}
				sm={4}
				key={user.uid}
				alignItems="center"
				style={{ marginBottom: "1rem", marginTop: "1rem" }}
			>
				<Grid item={true} xs={3}>
					<Avatar src={user.photoURL} alt={user.displayName} size={65} />
				</Grid>
				<Grid container={true} item={true} xs={9}>
					<Grid item={true} xs={12}>
						<Typography variant="title">{user.displayName}</Typography>
					</Grid>
					<Grid item={true} xs={12}>
						{user != null ? (
							<Typography variant="caption">{user.email}</Typography>
						) : null}
					</Grid>
					<Grid container={true} item={true} xs={12} sm={11} justify="flex-end">
						<Button variant="text" color="primary">
							<LinkButton to={`/my-students/user/${user.uid}`}>View</LinkButton>
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);

		return (
			<Grid container={true}>
				<Grid item={true} xs={12}>
					<Search
						value={filter}
						placeholder="Search something"
						onChange={this.search}
					/>
				</Grid>
				<Grid container={true} item={true}>
					{users.map(
						(user: IUser): JSX.Element | any => {
							if (filter.length > 0) {
								if (
									user != null &&
									(user.displayName
										.toLowerCase()
										.search(filter.toLowerCase()) !== -1 ||
										user.email.toLowerCase().search(filter.toLowerCase()) !==
											-1)
								) {
									return card(user);
								} else {
									return null;
								}
							} else {
								return card(user);
							}
						}
					)}
				</Grid>
			</Grid>
		);
	}
}

export default UserList;
