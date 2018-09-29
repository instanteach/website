import *as React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices'
import InfoIcon from '@material-ui/icons/Info';
import MailIcon from '@material-ui/icons/Mail';

const NavItems = (
  <div>
    <ListItem button={true}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button={true}>
      <ListItemIcon>
        <ImportantDevicesIcon />
      </ListItemIcon>
      <ListItemText primary="Material Generator" />
    </ListItem>
    <ListItem button={true}>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="Contact Us" />
    </ListItem>
    <ListItem button={true}>
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="About Us" />
    </ListItem>
  </div>
);

export default NavItems;