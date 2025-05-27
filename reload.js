// reload.js
const livereload = require("livereload");
const server = livereload.createServer();
server.watch(__dirname + "/public");

