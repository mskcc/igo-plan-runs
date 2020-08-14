var express = require('express');
const QuotesController = require('../controllers/QuotesController');
var router = express.Router();

router.get('/runs', QuotesController.getRuns);

module.exports = router;
