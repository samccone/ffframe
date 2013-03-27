var express           = require('express');
var expressValidator  = require('express-validator');
var router            = require('./router/routes');
var server            = express();
var db                = require('./db/interface').connect();

server.use(express.bodyParser());
server.use(express.static(__dirname + "/public"));
server.use(expressValidator);
server.set('views', __dirname + "/views");
server.set("view engine", "jade");

router(server);

server.listen(process.env['port'] || 3000);
console.log("º Listeneing on "+ (process.env['port'] || 3000));