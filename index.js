
const Client = require('./src/client');


let client = new Client({
    username: 'demo@api.video',
    apiKey: 'LetsDemonstrateThisApplication',
    baseUri: 'https://ws-staging.api.video'
});

let video = client.videos.search();
video.then(function (result) {
    console.log(result);
});
