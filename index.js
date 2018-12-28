
const Client = require('./src/client');


let client = new Client({
    username: 'demo@api.video',
    apiKey: 'LetsDemonstrateThisApplication',
    baseUri: 'https://ws-staging.api.video'
});

let video = client.videos.get('vi6yiIAtl0rmTvXobfTj7ejy');

video.then(function (result) {
    console.log(result);
});