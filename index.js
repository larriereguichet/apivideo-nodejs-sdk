
const Client = require('./src/client');


let client = new Client({
    username: 'demo@api.video',
    apiKey: 'LetsDemonstrateThisApplication',
    baseUri: 'https://ws-staging.api.video'
});

let video = client.videos.get('vi7KQjXmmzwcsmIz3KQf6BOJ');


video.then(function (result) {
    console.log(result);
});
