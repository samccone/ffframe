global.port           = process.env['port'] || 3000;
var express           = require('express');
var expressValidator  = require('express-validator');
var router            = require('./router/routes');
var server            = express();
var db                = require('./db/interface').connect();
var passport          = require('passport');
var passportConfig    = require('./auth/config')(passport);


server.configure(function() {
  server.use(express.cookieParser());
  server.use(express.bodyParser());
  server.use(express.session({ secret: (process.env['SESSION-SECRET'] || 'this is annoying ok great') }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(server.router);
  server.set('views', __dirname + "/views");
  server.set("view engine", "jade");
  server.use(express.static(__dirname + "/public"));
});


router(server, passport);

server.listen(port);
console.log("º Listeneing on "+port);