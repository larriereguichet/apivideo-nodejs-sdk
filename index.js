
const Client = require('./src/client');


let client = new Client({
    username: 'demo@api.video',
    apiKey: 'LetsDemonstrateThisApplication',
    baseUri: 'https://ws-staging.api.video'
});

let video = client.videos.download('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4', 'Test sample');
video.then(function (result) {
    console.log(result);
});
