const Browser = require('./Browser/browser');
const Videos = require('./Api/videos');

let Client = function(config){
    this.username = config.username;
    this.apiKey = config.apiKey;
    this.baseUri = 'https://ws.api.video';

    if(config.baseUri !== undefined){
        this.baseUri = config.baseUri;
    }

    this.browser = new Browser(this.username, this.apiKey, this.baseUri);
    this.videos = new Videos(this.browser);
};

module.exports = Client;