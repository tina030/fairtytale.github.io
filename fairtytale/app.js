var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var app = express();
app.engine('html', require('express-art-template'));

//連接資料庫
const Database = require('./dbserver/db');
Database.connection();

//加載body-parser:
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//require router.js
var router = require('./router.js');
app.use(router);

app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public/', express.static('./public/'));


// app.listen(3000, function () {
//     console.log('Running at port 3000!');
// })
app.use(function (req, res, next) {
    // next(createError(404));
    next(errorHandle(res, 404));
  });
  
  app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return errorHandle(res, 400, 40001);
    }
    next();
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;