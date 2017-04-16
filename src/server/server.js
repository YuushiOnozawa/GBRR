import fs from 'fs';
import http from 'http';
import socket from 'socket.io';
import ApiKeys from '../../twitterKeys.json';
const twitter = require('twitter');

const client = new twitter({
    consumer_key: ApiKeys.consumer_key,
    consumer_secret: ApiKeys.consumer_secret,
    access_token_key: ApiKeys.access_token_key,
    access_token_secret: ApiKeys.access_token_secret
});

const server = http.createServer();
const io = socket.listen(server);

server.on('request', (req, res) => {
    const stream = fs.createReadStream('index.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    stream.pipe(res);
});

server.listen(8080);

client.stream('statuses/filter',
    {track: 'グラブル'},
    (stream) => {
        stream.on('data', (text) => {
            console.log(text);
        });

        stream.on('error', (err) => {
            console.log(err);
        });
    }
);

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
    }, 10000);
});