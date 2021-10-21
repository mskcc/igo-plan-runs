import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AppBar, Toolbar, Button, Typography, makeStyles } from '@material-ui/core';
import { HOME } from './configs/config.js';

import logo from './logo.png';

function Header() {
  const classes = useStyles();

  return (
    <AppBar position='static' title={logo} className={classes.header}>
      <Toolbar>
        <Avatar alt='mskcc logo' src={logo} className={classes.avatar} />

        <Typography color='inherit' variant='h6' className={classes.title}>
          IGO Run Planner
        </Typography>

        <Button>
          <NavLink to={`${HOME}/`} className={'mskcc-white nav-inactive'}>
            <Typography color='inherit' variant='h6'>
              Home
            </Typography>
          </NavLink>
        </Button>
        <Button>
          <NavLink to={`${HOME}/plan`} className={'mskcc-white nav-inactive'}>
            <Typography color='inherit' variant='h6'>
              Plan
            </Typography>
          </NavLink>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(3),
  },
  header: {
    backgroundColor: theme.palette.primary.logo,
    color: 'white',
    textAlign: 'center',
  },
  title: {
    marginRight: theme.spacing(3),
  },
}));

export default Header;
