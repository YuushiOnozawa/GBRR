import fs from 'fs';
import http from 'http';
import socket from 'socket.io';

const server = http.createServer();
const io = socket.listen(server);

server.on('request', (req, res) => {
    const stream = fs.createReadStream('index.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    stream.pipe(res);
});

server.listen(8080);

io.sockets.on('connection', (socket) => {
    socket.emit(
        'greeting',
        {message: 'hello'},
        (data) => {
            console.log(data);
        }
    );

    setInterval(() => {
        console.log(new Date());
        io.sockets.emit('update', {value: new Date()});
    }, 5000);
});



