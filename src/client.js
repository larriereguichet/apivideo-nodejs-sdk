const Browser = require('./Browser/browser');
const Videos = require('./Api/videos');

class Client{
    constructor(config){
        this.username = config.username;
        this.apiKey = config.apiKey;
        this.baseUri = 'https://ws.api.video';
        if(config.baseUri !== undefined){
            this.baseUri = config.baseUri;
        }
        this.browser = new Browser(this.baseUri);
        this.browser.authenticate(this.username, this.apiKey);

        this.videos = new Videos(this.browser);
    }
}

module.exports = Client;