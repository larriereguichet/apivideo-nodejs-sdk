const Video = require('../Model/video');
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const fs = require('fs');
const path = require('path');
const os = require ('os');
const tempname = require ('tempnam');
const http_build_query = require('locutus/php/url/http_build_query');

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
        }).catch(function (e) {
            console.log(e.statusCode);
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
            let response = await this.browser.get('/videos?' + http_build_query(params));

            if(that.browser.isSuccessfull(response)){
                let results = response.body;
                let videos = results.data;
                allVideos.push(that.castAll(videos));

                if(typeof parameters.currentPage !== 'undefined'){
                    break;
                }

                pagination = results.pagination;
                pagination.currentPage++;
                params.currentPage = pagination.currentPage;
            }

        } while (pagination.pagesTotal > pagination.currentPage);

        return new Promise(async function (resolve, reject) {
            try{
                let videos = [];
                if(allVideos.hasOwnProperty(0)){
                    videos = allVideos[0];
                }
                for(let x=1; x < allVideos.length; x++){
                    if(allVideos.hasOwnProperty(x)){
                        array_merge(videos, allVideos[x]);
                    }
                }
                resolve(videos);
            }catch (e) {
                reject(e);
            }
        });

    };

    this.download = async function (source, title, properties = {}) {
        properties.source = source;

        return this.create(title, properties);
    };

    this.upload = async function (source, properties = {}, videoId = null) {
        let that = this;

        if(!fs.existsSync(source)){
            throw source + ' must be a readable source file';
        }

        if(null === videoId){
            console.log('Create video before upload');
            if (typeof properties.title === 'undefined') {
                properties.title = path.basename(source);
            }
            let video = await this.create(properties.title, properties);
            videoId = video.videoId;
            console.log('videoId returned after creation '+videoId);
        }

        let length = fs.statSync(source).size;
        console.log('File size to upload '+length);

        if(0 >= length){
            throw  source + 'is empty';
        }

        // Upload in a single request when file is small enough
        if(this.chunkSize > length){
            console.log('Upload in a single request');
            let response = await this.browser.submit(
                '/videos/' + videoId + '/source',
                source
            );
            return new Promise(function (resolve, reject) {
                if(!that.browser.isSuccessfull(response)){
                    reject(response);
                }else{
                    let video = that.cast(response.body);
                    resolve(video);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }

        let readableStream = fs.createReadStream(source, {
            highWaterMark: this.chunkSize
        });
        
        console.log('Upload in range request from '+readableStream.path);

        let chunks = [];
        readableStream.on('readable', async function () {
            let chunkPath = tempname.tempnamSync(os.tmpdir(), 'upload-chunk-');
            let chunk;
            while (null !== (chunk = readableStream.read(that.chunkSize))){
                fs.writeFileSync(chunkPath, chunk,{
                    flags: 'w+'
                });
                chunks.push(chunkPath);
            }

        });

        let copiedBytes = 0;
        return new Promise(async function (resolve, reject) {
            let lastResponse = null;
            await readableStream.on('end', async function () {
                for (let key in chunks) {
                    if (chunks.hasOwnProperty(key)) {
                        let chunk = chunks[key];
                        console.log('Try reading chunk file ' + chunk);
                        let chunkFile = fs.readFileSync(chunk);
                        let from = copiedBytes;
                        copiedBytes += chunkFile.length;
                        lastResponse = await that.browser.submit(
                            '/videos/' + videoId + '/source',
                            chunk,
                            {
                                'Content-Range': 'bytes ' + from + '-' + (copiedBytes - 1) + '/' + length
                            }
                        ).catch(function (error) {
                            console.log(error);
                        });
                        fs.unlinkSync(chunk);
                    }
                }
                if (null === lastResponse) {
                    reject(lastResponse);
                } else {
                    let video = that.cast(lastResponse.body);
                    resolve(video);
                }
            });
        }).catch(function (error) {
            console.log(error);
        });
    };

    this.uploadThumbnail = async function (source, videoId) {
        let that = this;

        if(!fs.existsSync(source)){
            throw source + ' must be a readable source file';
        }

        let length = fs.statSync(source).size;
        console.log('File size to upload '+length);

        if(0 >= length){
            throw  source + 'is empty';
        }

        let response = await this.browser.submit(
            '/videos/' + videoId + '/thumbnail',
            source
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let video = that.cast(response.body);
                resolve(video);
            }
        }).catch(function (error) {
            console.log(error);
        });
    };

    this.update = async function (videoId, properties = {}) {
        let that = this;
        let response = await this.browser.patch(
            '/videos/' + videoId,
            {},
            properties
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

    this.makePublic = async function (videoId) {
        let that = this;
        let response = await this.browser.patch(
            '/videos/' + videoId,
            {},
            {public: true}
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

    this.makePrivate = async function (videoId) {
        let that = this;
        let response = await this.browser.patch(
            '/videos/' + videoId,
            {},
            {public: false}
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

    this.updateThumbnailWithTimecode = async function (videoId, timecode) {
        let that = this;
        if(!timecode){
            throw 'Timecode is empty';
        }
        let response = await this.browser.patch(
            '/videos/' + videoId + '/thumbnail',
            {},
            {timecode: timecode}
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

    this.delete = async function (videoId) {
        let that = this;

        let response = await this.browser.delete( '/videos/' + videoId);

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                resolve(response.statusCode);
            }
        });
    };

};

Videos.prototype.castAll = function(collection) {
    return array_map(function(data) {
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
    }, collection);
};

Videos.prototype.cast = function(data) {
    if(!data){
        return null;
    }
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