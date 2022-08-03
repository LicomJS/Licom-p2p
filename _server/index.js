var port = 8765;
var express = require("express");
var Gun = require("gun");
var app = express();

var server = app.listen(port);
Gun({ file: "data", web: server });

console.log("Server started on port " + port + " with /gun");
