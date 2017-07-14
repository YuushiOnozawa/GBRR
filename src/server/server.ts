import * as fs from 'fs';
import * as http from 'http';
import * as socket from 'socket.io';
import Apikey from '../../twitterKeys';
// https://github.com/ttezel/twit?
const twitter = require('twit');
const client = new twitter({
    consumer_key: Apikey.consumer_key,
    consumer_secret: Apikey.consumer_secret,
    access_token: Apikey.access_token_key,
    access_token_secret: Apikey.access_token_secret
});

const server = http.createServer();
const io = socket.listen(server);
const searchQuery = '参加者募集！参戦ID';
const limitMargin = 10;

server.on('request', (req, res) => {
    const stream = fs.createReadStream('index.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    stream.pipe(res);
});

server.listen(8080);

namespace getTweetClass {
    export let getCount;
    export let limitNum;
    export let resetTime;
    export let getInterval: number = 5000;
    export let getTweetTimer;
    export let lastTweetId: number = 0;

    export function init() {
        getTweetClass.updateLimitTime();
        getTweetClass.getTweet();
        getTweetClass.getTweetTimer = setInterval(getTweetClass.getTweet, getTweetClass.getInterval);
    }

    export function updateLimitTime(): void {
        client.get('application/rate_limit_status', {resources: 'search'}, (err, limit, res) => {
            getTweetClass.limitNum = limit.resources.search['/search/tweets'].remaining;
            getTweetClass.resetTime = limit.resources.search['/search/tweets'].reset;
            getTweetClass.getInterval = Math.round(((getTweetClass.resetTime - +(Date.now().toString().substr(0, Date.now().toString().length - 3)) ) / (getTweetClass.limitNum - limitMargin)) * 1000);
        });
    }

    export function  getTweet () {
        if(getTweetClass.getCount < limitMargin) {
            getTweetClass.updateLimitTime();
            clearInterval(getTweetClass.getTweetTimer);
            getTweetClass.getTweetTimer = setInterval(getTweetClass.getTweet, getTweetClass.getInterval);
        } else {
            client.get('search/tweets', { q: searchQuery, count: 10, result_type: 'mixed', include_entities: true, since_id: lastTweetId }, (err, data) => {
                const statuses = data.statuses;
                getTweetClass.getCount = getTweetClass.limitNum - 1;
                lastTweetId = data.search_metadata.max_id;
                [].forEach.call(statuses, (item) => {
                    console.log(`${item.user.name} > ${item.text}`);
                });
            });
        }
    }

    getTweetClass.init();
}

// io.sockets.on('connection', (socket) => {
//     socket.emit(
//         'greeting',
//         {message: 'hello'},
//         (data) => {
//             console.log(`greet: ${data}`);
//         }
//     );
//
//     // setInterval(() => {
//     //     console.log(new Date());
//     //     io.sockets.emit('update', {value: new Date()});
//     // }, 10000);
// });