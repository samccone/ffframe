var express = require('express');
var router  = require('./router/routes');
var server  = express();


server.use(express.bodyParser());
server.use(express.static(__dirname + "/public"));
server.set('views', __dirname + "/views");
server.set("view engine", "jade");

router(server);
server.listen('3000');
console.log("Listeneing on Port 3000");