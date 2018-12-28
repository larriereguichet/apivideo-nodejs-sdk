const p = require('phin');
const Helper = require('../Utils/helper');
const request = require('request');



let Browser = function(username, apiKey, baseUri){

    this.username = username;
    this.apiKey = apiKey;
    this.baseUri = baseUri;
    this.token_type = 'Bearer';
    this.access_token = null;
    this.refresh_token = null;
    this.headers = {};
    this.lastRequest = null;

    this.getAccessToken = function(){
        let that = this;
        return new Promise(function (resolve, reject) {
            let token = {};
            request.post({
                url: that.baseUri + '/token',
                body: {
                    "username": that.username,
                    "password": that.apiKey
                },
                json: true
            }, function (error, response, body) {
                if(error){
                    reject(error);
                }else{
                    if (response.statusCode >= 400) {
                        throw 'Authentication Failed'
                    }
                    token = that.setAccessToken(body.token_type, body.access_token, body.refresh_token);
                    resolve(token);
                }
            });
        });

    };

    this.setAccessToken = function(token_type, access_token, refresh_token){
        this.token_type = token_type;
        this.access_token = access_token;
        this.refresh_token = refresh_token;

        return {
            token_type : this.token_type,
            access_token : this.access_token,
            refresh_token : this.refresh_token
        }
    };

    this.isStillAuthenticated = async function (response) {
        let that = this;
        if (response.statusCode === 401 && 'application/problem+json' === response.headers['content-type']) {
            let lastRequest = this.lastRequest;
            // noinspection JSIgnoredPromiseFromCall
            let token = await this.getAccessToken();
            let headers = lastRequest.headers;
            for (let key in headers) {
                if (headers.hasOwnProperty(key)) {
                    if (key === 'Authorization') {
                        delete headers.key;
                    }
                }
            }
            headers['Authorization'] = token.token_type + ' ' + token.access_token;
            lastRequest.headers = headers;

            return new Promise(function (resolve, reject) {
                request(lastRequest, function (error, resp, body) {
                    if(error){
                        reject(error);
                    }else{
                        resolve(resp);
                    }
                });
            });
        }

        return response;
    };
};

Browser.prototype.get = function(path, headers = {}) {
    let self = this;

    this.lastRequest = {
        url: this.baseUri + path,
        method: 'GET',
        headers: Helper.extend(this.headers, headers),
        json: true
    };

    return new Promise(function (resolve, reject) {
        request(self.lastRequest, async function (error, response, body) {
            if (error) {
                reject(error);
            }else{
                let result = await self.isStillAuthenticated(response);
                resolve(result);
            }
        });
    })



};

Browser.prototype.isSuccessfull = function(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
};


module.exports = Browser;