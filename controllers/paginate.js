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
router.get('/', function (request, response) {
    var perPage = 10, page = Math.max(0, request.query.pageNo);
    var query = Paginate.find({}).skip(page * perPage).limit(perPage);
    Paginate.count({}, function (error, totalCount) {
        var result = {};
        query.exec(function (error, paginate) {
            if (error) {
                response.send(error);
            }
            result.pageNo = page + 1;
            result.totalCount = totalCount;
            result.perPageCount = paginate.length;
            result.data = paginate;
            response.send(result);
        });
    });
});

module.exports = router;
