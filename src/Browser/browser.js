const p = require('phin');
const Helper = require('../Utils/helper');

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

    async getAccessToken(){
        let response = await this.browser({
            url: this.baseUri + '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "username": this.username,
                "password": this.apiKey
            },
            parse: 'json'
        });
        // noinspection JSUnresolvedVariable
        if(response.statusCode >= 400){
            throw 'Authentication Failed'
        }
        this.token_type = response.body.token_type;
        this.access_token = response.body.access_token;
        this.refresh_token = response.body.refresh_token;
        this.headers['Authorization'] = 'Authorization: ' + this.token_type + ' ' + this.access_token;
        console.log(this.headers);
    }

    async isStillAuthenticated(response){
        if(response.statusCode === 401 && 'application/problem+json' === response.headers['content-type']){

            console.log('ko');
            let lastRequest = this.lastRequest;
            // noinspection JSIgnoredPromiseFromCall
            await this.getAccessToken();

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
            response =  await this.browser(this.lastRequest);
        }

        return response;
    }

    async get(path, headers = {}) {
        console.log(this.headers, headers, Helper.extend(this.headers, headers));
        this.lastRequest = {
            url: this.baseUri + path,
            method: 'GET',
            headers: Helper.extend(this.headers, headers),
            parse: 'json'
        };

        return this.isStillAuthenticated(
            await this.browser(this.lastRequest)
        )
    }

    static isSuccessfull(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
    }
}

module.exports = Browser;