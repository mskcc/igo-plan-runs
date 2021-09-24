var express = require('express');
const RunsController = require('../controllers/RunsController');
var router = express.Router();

router.get('/runs', RunsController.getRuns);
router.get('/plan', RunsController.plan);

module.exports = router;

