var express = require('express');
var runController = require('./runs');

var app = express();

app.use('/runs/', runController);

module.exports = app;
