
const Client = require('./src/client');


let client = new Client({
    username: 'demo@api.video',
    apiKey: 'LetsDemonstrateThisApplication',
    baseUri: 'https://ws-staging.api.video'
});

let video = client.videos.upload('/home/antho/Bureau/source.mp4');

video.then(function (result) {
    console.log(result);
}).catch(function (error) {
    console.log(error);
});