import fs from 'fs';
import http from 'http';
import socket from 'socket.io';

const server = http.createServer();

server.on('request', (req, res) => {
    const stream = fs.createReadStream('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    stream.pipe(res);
});

socket.listen(server);
server.listen(8080);