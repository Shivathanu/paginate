var express = require('express');
var router = express.Router();
var paginate = require('./paginate');

router.use('/paginate', paginate);

module.exports = router;
