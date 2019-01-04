const Live = require('../Model/live');
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const fs = require('fs');
const path = require('path');
const os = require ('os');
const tempname = require ('tempnam');
const http_build_query = require('locutus/php/url/http_build_query');

let Lives = function(browser) {

    this.browser = browser;

    this.get = async function (liveStreamId) {
        let that = this;
        let response = await this.browser.get('/live-streams/' + liveStreamId);

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let live = that.cast(response.body);
                resolve(live);
            }
        }).catch(function (e) {
            console.log(e.statusCode);
        });
    };

    this.create = async function (name, properties = {}) {
        let that = this;
        let response = await this.browser.post(
            '/live-streams',
            {},
            array_merge(properties, {name: name})
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let live = that.cast(response.body);
                resolve(live);
            }
        });
    };

    this.search = async function (parameters = {}) {
        let that = this;
        let params = parameters;
        let currentPage = (typeof parameters.currentPage !== 'undefined') ? parameters.currentPage : 1;
        params.pageSize = (typeof parameters.pageSize !== 'undefined') ? parameters.pageSize : 100;
        params.currentPage = currentPage;
        let allLives = [];
        let pagination = {};
        do {
            let response = await this.browser.get('/live-streams?' + http_build_query(params));

            if(that.browser.isSuccessfull(response)){
                let results = response.body;
                let lives = results.data;
                allLives.push(that.castAll(lives));

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
                let lives = [];
                if(allLives.hasOwnProperty(0)){
                    lives = allLives[0];
                }
                for(let x=1; x < allLives.length; x++){
                    if(allLives.hasOwnProperty(x)){
                        array_merge(lives, allLives[x]);
                    }
                }
                resolve(lives);
            }catch (e) {
                reject(e);
            }
        });

    };

    this.uploadThumbnail = async function (source, liveStreamId) {
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
            '/live-streams/' + liveStreamId + '/thumbnail',
            source
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let live = that.cast(response.body);
                resolve(live);
            }
        }).catch(function (error) {
            console.log(error);
        });
    };

    this.update = async function (liveStreamId, properties = {}) {
        let that = this;
        let response = await this.browser.patch(
            '/live-streams/' + liveStreamId,
            {},
            properties
        );

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                let live = that.cast(response.body);
                resolve(live);
            }
        });
    };

    this.delete = async function (liveStreamId) {
        let that = this;

        let response = await this.browser.delete( '/live-streams/' + liveStreamId);

        return new Promise(function (resolve, reject) {
            if(!that.browser.isSuccessfull(response)){
                reject(response);
            }else{
                resolve(response.statusCode);
            }
        });
    };

};

Lives.prototype.castAll = function(collection) {
    return array_map(function(data) {
        let live = new Live();
        live.liveStreamId = data.liveStreamId;
        live.name = data.name;
        live.streamKey = data.streamKey;
        live.record = data.record;
        live.broadcasting = data.broadcasting;
        live.assets = data.assets;

        return live;
    }, collection);
};

Lives.prototype.cast = function(data) {
    if(!data){
        return null;
    }
    let live = new Live();
    live.liveStreamId = data.liveStreamId;
    live.name = data.name;
    live.streamKey = data.streamKey;
    live.record = data.record;
    live.broadcasting = data.broadcasting;
    live.assets = data.assets;

    return live;
};

module.exports = Lives;