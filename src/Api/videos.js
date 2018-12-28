const AbstractBaseApi = require('./abstractBaseApi');
const Video = require('../Model/video');
const Browser = require("../Browser/browser");

let Videos = function(browser) {

    this.browser = browser;
    this.chunkSize = 64 * 1024 * 1024;

    this.get = async function (videoId) {
        let that = this;
        let response = await this.browser.get('/videos/' + videoId);

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(null);
            }else{
                let video = that.cast(response.body);
                resolve(video);
            }
        });
    };
};

Videos.prototype.cast = function(data) {
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
};

module.exports = Videos;