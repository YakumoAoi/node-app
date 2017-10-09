const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const topicRouter = require('./routes/topic')
const Errors = require('./error')
const logger = require('./logger').logger

const app = express();
require('./service/mongoose')
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/topic', topicRouter)

app.use(require('./req_log').requestLogger)
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if (err instanceof Errors.BasehttpError) {
        res.statusCode = err.httpCode
        res.json({
            code: err.OPCode,
            msg: err.httpMsg
        })
    } else {
        res.statusCode = 500
        res.json({
            code: Errors.BasehttpError.DEFAULT_OPCODE,
            msg: '服务器出现问题，请稍后再试'
        })
    }
    logger.error('reponse error to user', err)
});

module.exports = app;