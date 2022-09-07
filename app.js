const http = require('http');
const path = require('path');
const express = require('express');

let wss;
let server;
const app = express();
app.use(express.static(path.join(__dirname, './index.html')));

server = new http.createServer(app);

server.on('error', err => console.log('Server error:', err));
server.listen('8000');