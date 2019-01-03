const array_merge = require('locutus/php/array/array_merge');
const request = require('request');
const fs = require('fs');



let Browser = function(username, apiKey, baseUri){

    this.username = username;
    this.apiKey = apiKey;
    this.baseUri = baseUri;
    this.token_type = 'Bearer';
    this.access_token = null;
    this.refresh_token = null;
    this.headers = {};
    this.baseRequest = request.defaults();
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
                        throw 'Authentication Failed';
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
            this.headers['Authorization'] = token.token_type + ' ' + token.access_token;
            lastRequest.headers = headers;
            if((typeof lastRequest.formData !== 'undefined')){
                lastRequest.formData.file = fs.createReadStream(lastRequest.formData.file.path);
            }
            response = new Promise(function (resolve, reject) {
                that.baseRequest(lastRequest, function (error, resp, body) {
                    //console.log(resp);
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
        headers: array_merge(this.headers, headers),
        json: true
    };

    return new Promise(function (resolve, reject) {
        self.baseRequest(self.lastRequest, async function (error, response, body) {
            if (error) {
                reject(error);
            }else{
                let result = await self.isStillAuthenticated(response);
                resolve(result);
            }
        });
    })
};

Browser.prototype.post = function(path, headers = {}, content = {}) {
    let self = this;

    this.lastRequest = {
        url: this.baseUri + path,
        method: 'POST',
        headers: array_merge(this.headers, headers),
        body: content,
        json: true
    };

    return new Promise(function (resolve, reject) {
        self.baseRequest(self.lastRequest, async function (error, response, body) {
            if (error) {
                reject(error);
            }else{
                let result = await self.isStillAuthenticated(response);
                resolve(result);
            }
        });
    })
};

Browser.prototype.patch = function(path, headers = {}, content = {}) {
    let self = this;

    this.lastRequest = {
        url: this.baseUri + path,
        method: 'PATCH',
        headers: array_merge(this.headers, headers),
        body: content,
        json: true
    };

    return new Promise(function (resolve, reject) {
        self.baseRequest(self.lastRequest, async function (error, response, body) {
            if (error) {
                reject(error);
            }else{
                let result = await self.isStillAuthenticated(response);
                resolve(result);
            }
        });
    })
};

Browser.prototype.submit = async function (path, source, headers = {}) {
    let self = this;
    this.lastRequest = {
        url: this.baseUri + path,
        method: 'POST',
        headers: array_merge(this.headers, headers),
        formData: {
            file: fs.createReadStream(source)
        },
        json: true
    };

    return new Promise(function (resolve, reject) {
        self.baseRequest(self.lastRequest, async function (error, response, body) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                let result = await self.isStillAuthenticated(response);
                resolve(result);
            }
        });
    })
};

Browser.prototype.delete = function(path, headers = {}) {
    let self = this;

    this.lastRequest = {
        url: this.baseUri + path,
        method: 'DELETE',
        headers: array_merge(this.headers, headers),
        json: true
    };

    return new Promise(function (resolve, reject) {
        self.baseRequest(self.lastRequest, async function (error, response, body) {
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