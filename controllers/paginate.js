var express = require('express');
var router = express.Router();
var lodash = require('lodash');
var Paginate = require('../models/paginate');

/**
 * Express router to connect "/api/paginate/list"
 *
 * @param {Object} request
 * @param {Object} response
 */
router.get('/:pageNo', function (request, response) {
    var perPage = 10, page = Math.max(0, request.param('pageNo'));
    var query = Paginate.find({}).skip(page * perPage).limit(perPage);
    Paginate.count({}, function (error, totalCount) {
        query.exec(function (error, paginate) {
            if (error) {
                response.send(error);
            }
            paginate.unshift({ totalCount: totalCount, pageNo: page });
            response.send(paginate);
        });
    });    
});

module.exports = router;
