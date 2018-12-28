const AbstractBaseApi = require('./abstractBaseApi');
const Video = require('../Model/video');
const Browser = require("../Browser/browser");
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const call_user_func_array = require('locutus/php/funchand/call_user_func_array');
const Helper = require('../Utils/helper');

let Videos = function(browser) {

    this.browser = browser;
    this.chunkSize = 64 * 1024 * 1024;

    this.get = async function (videoId) {
        let that = this;
        let response = await this.browser.get('/videos/' + videoId);

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let video = that.cast(response.body);
                resolve(video);
            }
        });
    };

    this.create = async function (title, properties = {}) {
        let that = this;
        let response = await this.browser.post(
            '/videos',
            {},
            array_merge(properties, {title: title})
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let video = that.cast(response.body);
                resolve(video);
            }
        });
    };

    this.search = async function (parameters = {}) {
        let that = this;
        let params = parameters;
        let currentPage = (typeof parameters.currentPage !== 'undefined') ? parameters.currentPage : 1;
        params.pageSize = (typeof parameters.pageSize !== 'undefined') ? parameters.pageSize : 100;
        params.currentPage = currentPage;
        let allVideos = [];
        let pagination = {};
        do {
            let response = await this.browser.get('/videos/' + videoId);

            let results = new Promise(function (resolve) {
                if(that.browser.isSuccessfull(response)){
                    resolve(response.body);
                }
            });

            let videos = results.data;
            allVideos.push(this.castAll(videos));

            pagination = results.pagination;
            pagination.currentPage++;
            params.currentPage = pagination.currentPage;

        } while (pagination.pagesTotal > pagination.currentPage);

        allVideos = call_user_func_array('array_merge', allVideos);

        return allVideos;

    };

    this.download = async function (source, title, properties = {}) {
        properties.source = source;

        return this.create(title, properties);
    };

    this.upload = async function (source, properties = {}, videoId = null) {
        let that = this;
        let response = await this.browser.post(
            '/videos',
            {},
            array_merge(properties, {title: title})
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let video = that.cast(response.body);
                resolve(video);
            }
        });
    };

};

Videos.prototype.castAll = function(collection) {
    return array_map(this.cast(), collection);
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