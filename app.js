var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var httpRequest = require('request');
var compression = require('compression');
var cors = require('cors');

// Connection URL
var url = 'mongodb://localhost:27017/test';

var indexRouter = require('./routes/index');
var apiRouter = require('./controllers/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var openMongoDbConnection = function () {
  mongoose.connect(url);
  mongoose.Promise = global.Promise;
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  return db;
};

var connection = openMongoDbConnection();

// var redShiftConnection = openRedShiftConnection();
app.all('*', function (request, response, next) {
  request.connection = connection ? connection : openMongoDbConnection();
  next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
* Get port from environment and store in Express.
*/
var port = normalizePort(process.env.PORT || '3040');
app.set('port', port);

/**
* Create HTTP server.
*/
var server = http.createServer(app);

/**
* Listen on provided port, on all network interfaces.
*/
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 240000;

/**
* Normalize a port into a number, string, or false.
*/
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
* Event listener for HTTP server "error" event.
*/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = app;
