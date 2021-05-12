var express = require('express');
var runController = require('./runs');
const poolController = require('./pools');
const remainingController = require('./remaining');
var app = express();

app.use('/runs/', runController);
app.use('/pools', poolController);
app.use('/rem', remainingController);

module.exports = app;
