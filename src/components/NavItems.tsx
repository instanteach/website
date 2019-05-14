import * as React from 'react';
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AddBoxIcon from '@material-ui/icons/AddBox';
import DescriptionIcon from '@material-ui/icons/Description';
import GroupIcon from '@material-ui/icons/Group';
import HomeIcon from '@material-ui/icons/Home';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices'
import InfoIcon from '@material-ui/icons/Info';
import MailIcon from '@material-ui/icons/Mail';
import SchoolIcon from '@material-ui/icons/School';

const CustomLink = styled(Link)`
  text-decoration: none;
`

const NavItems = ({session, onClick}) => (
  <div>
    <CustomLink to="/" onClick={onClick}>
      <ListItem button={true}>
        <ListItemIcon>
            <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </CustomLink>
		{
			session
			? (
				<>
				<CustomLink to="/material-generator" onClick={onClick}>
					<ListItem button={true}>
						<ListItemIcon>
							<ImportantDevicesIcon />
						</ListItemIcon>
						<ListItemText primary="Material Generator" />
					</ListItem>
				</CustomLink>
				<CustomLink to="/my-students" onClick={onClick}>
					<ListItem button={true}>
						<ListItemIcon>
							<SchoolIcon />
						</ListItemIcon>
						<ListItemText primary="My Students" />
					</ListItem>
				</CustomLink>
				</>
			) : null
		}
    <CustomLink to="/lesson-plans" onClick={onClick}>
      <ListItem button={true}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Lesson Plans" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/contact" onClick={onClick}>
      <ListItem button={true}>
        <ListItemIcon>
          <MailIcon />
        </ListItemIcon>
        <ListItemText primary="Contact Us" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/about-us" onClick={onClick}>
      <ListItem button={true}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About Us" />
      </ListItem>
    </CustomLink>
		<Divider />
		{
			session && session.isAdmin
			? (
				<>
				<CustomLink to="/users" onClick={onClick}>
					<ListItem button={true}>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Users" />
					</ListItem>
				</CustomLink>
				<CustomLink to="/upload" onClick={onClick}>
					<ListItem button={true}>
						<ListItemIcon>
							<AddBoxIcon />
						</ListItemIcon>
						<ListItemText primary="Upload" />
					</ListItem>
				</CustomLink>
				</>
			) : null
		}
  </div>
);

export default (NavItems);