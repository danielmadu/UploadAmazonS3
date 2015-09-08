var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port',3000);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = (function(){
    return app;
})();
