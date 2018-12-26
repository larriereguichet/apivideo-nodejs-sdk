const AbstractBaseApi = require('./abstractBaseApi');
const Video = require('../Model/video');
const Browser = require("../Browser/browser");

class Videos extends AbstractBaseApi{

    constructor(browser){
        super(browser);
        this.chunkSize = 64 * 1024 * 1024;
    }

    get(videoId){
        let response = this.browser.get('/videos/' + videoId);
        if(!Browser.isSuccessfull(response)){
            return null;
        }

        return Videos.cast(response.body);
    }

    static cast(data) {
        let video = new Video();
        video.videoId = data.videoId;
        video.title = data.title;
        video.description = data.description;
        video.public = data.public;
        video.tags = data.tags;
        video.metadata = data.metadata;
        video.source = data.source;
        video.publishedAt = data.publishedAt;
        video.assets = data.assets;

        return video;
    }
}
module.exports = Videos;