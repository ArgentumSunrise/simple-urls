var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Max-Age", "3600");

    next();
})

mongoose.connect('mongodb://localhost/urls');

mongoose.connection.on('open', function() {
  console.log("Mongoose connected.");
})

var UrlSchema = mongoose.Schema({
  orgUrl: String,
  shortUrl: String,
})

var Url = mongoose.model('Url', UrlSchema);

function makeShort(url) {
  // from Henry Kaufman's URL shortener, https://github.com/hcjk/ShortURL
  var str = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', {
        title: 'URL Shortener'
    });
});

app.post('/', function(req, res) {
  var longUrl = req.body.url;
  var short = makeShort(longUrl);
  console.log(longUrl);

  function isAlreadyShort() {
    Url.findOne({shortUrl: short}, function(err, url) {
      if(url) {
        short = makeShort(longUrl);
        isAlreadyShort();
      }
    })
  }
  isAlreadyShort();

  var curUrl = Url({
    orgUrl: longUrl,
    shortUrl: short
  });

  Url.findOne({orgUrl: longUrl}, function(err, url) {
    if(url) {
      curUrl = url;
    }
  })

  curUrl.save(function(err, obj) {
    console.log(obj);
  })
});

app.get('/:url', function (req, res) {
  // from Henry Kaufman's URL shortener, https://github.com/hcjk/ShortURL
    var url = req.params.url;
    Url.findOne({shortUrl: url}, function(err, link) {
        if(link) {
            res.redirect(link.orgUrl);
        }
        else {
            res.render('error', {
                title: 'Error'
            });
        }
    });
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
