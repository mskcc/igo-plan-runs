var express = require('express');
var runController = require('./runs');
const poolController = require('./pools');
var app = express();

app.use('/runs/', runController);
app.use('/pools', poolController);

module.exports = app;
