import fs from 'fs';
import http from 'http';
import socket from 'socket.io';
import ApiKeys from '../../twitterKeys.json';
// https://github.com/ttezel/twit?
const twitter = require('twit');

const client = new twitter({
    consumer_key: ApiKeys.consumer_key,
    consumer_secret: ApiKeys.consumer_secret,
    access_token: ApiKeys.access_token_key,
    access_token_secret: ApiKeys.access_token_secret
});

const server = http.createServer();
const io = socket.listen(server);
const searchQuery = '参加者募集！参戦ID';
const limitMargin = 10;
let getCount;
let limitNum;
let resetTime;
let getInterval;
let getTweetTimer;

server.on('request', (req, res) => {
    const stream = fs.createReadStream('index.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    stream.pipe(res);
});

server.listen(8080);

function updateLimitCount() {
    client.get('application/rate_limit_status', {resources: 'search'}, (err, limit, res) => {
        limitNum = limit.resources.search['/search/tweets'].remaining;
        resetTime = limit.resources.search['/search/tweets'].reset;
        getInterval = (resetTime - Date.now()) / (limitNum - limitMargin);
        console.log(`limitNum: ${limitNum}\nresetTime: ${resetTime}\ninterval: ${getInterval}`);
    });
}

updateLimitCount();

function getTweet () {
    if(getCount < limitMargin) {
        updateLimitCount();
        clearInterval(getTweetTimer);
        getTweetTimer = setInterval(getTweet, getInterval);
    }

    client.get('search/tweets', { q: searchQuery, count: 5, result_type: 'mixed', include_entities: true }, (err, data) => {
        getCount = limitNum - 1;
        const statuses = data['statuses'];
        console.log(statuses);
        for (let i = statuses.length - 1; i >= 0; i--) {
            let user_name = statuses[i].user.name;
            let text = statuses[i].text;
            //console.log(i + ' : ' + user_name + ' > ' + text);
        }
    });
}

getTweetTimer = setInterval(getTweet, getInterval);


// stream and search word
// var stream = client.stream('statuses/filter', {track: 'node'} );
//
// stream.on('tweet', function(tw) {
//     var text = tw.text;
//     var user_name = tw.user.name;
//     console.log(user_name + "> " + text);
// });
// client.stream('statuses/filter',
//     {track: 'グラブル'},
//     (stream) => {
//         stream.on('data', (text) => {
//             console.log(text);
//         });
//
//         stream.on('error', (err) => {
//             console.log(err);
//         });
//     }
// );

// client.get('/search/tweets.json', {"q":"#Node"}, (err, data) => {
//     console.log(err);
//     console.log(data);
// });

io.sockets.on('connection', (socket) => {
    socket.emit(
        'greeting',
        {message: 'hello'},
        (data) => {
            console.log(`greet: ${data}`);
        }
    );

    // setInterval(() => {
    //     console.log(new Date());
    //     io.sockets.emit('update', {value: new Date()});
    // }, 10000);
});