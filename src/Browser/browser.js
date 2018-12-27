const p = require('phin');
const Helper = require('../Utils/helper');
const request = require('request');

class Browser{

    constructor(baseUri){
        this.baseUri = baseUri;
        this.browser = p;
        this.headers = {};
        this.lastRequest = null;
    }

    authenticate(username, apiKey) {
        this.username = username;
        this.apiKey = apiKey;

        // noinspection JSIgnoredPromiseFromCall
        this.getAccessToken();
    }

    getAccessToken(){
        let that = this;
        request.post({
            url: this.baseUri + '/token',
            body: {
                "username": this.username,
                "password": this.apiKey
            },
            json: true
        }, function (error, response, body) {
            if(response.statusCode >= 400){
                throw 'Authentication Failed'
            }
            this.token_type = body.token_type;
            this.access_token = body.access_token;
            this.refresh_token = body.refresh_token;
            that.headers['Authorization'] = 'Authorization: ' + this.token_type + ' ' + this.access_token;
        });

    }

    isStillAuthenticated(response){
        if(response.statusCode === 401 && 'application/problem+json' === response.headers['content-type']){
            let lastRequest = this.lastRequest;
            // noinspection JSIgnoredPromiseFromCall
            this.getAccessToken();

            let headers = lastRequest.headers;
            for(let key in headers){
                if(headers.hasOwnProperty(key)){
                   if(key === 'Authorization'){
                       delete headers.key;
                   }
                }
            }
            headers['Authorization'] = 'Authorization: ' + this.headers['Authorization'];
            lastRequest.headers = headers;
            request(lastRequest, function (error, resp, body) {
                response = resp;
            });
        }

        return response;
    }

    get(path, headers = {}) {
        let that = this;


        console.log(that.headers);
        // that.lastRequest = {
        //     url: this.baseUri + path,
        //     method: 'GET',
        //     headers: Helper.extend(this.headers, headers),
        //     json: true
        // };
        //
        // request(that.lastRequest, function (error, response, body) {
        //     return that.isStillAuthenticated(response);
        // });


    }

    static isSuccessfull(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
    }
}

module.exports = Browser;