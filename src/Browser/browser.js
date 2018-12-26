const p = require('phin');
const Helper = require('../Utils/helper');

class Browser{

    constructor(baseUri){
        this.baseUri = baseUri;
        this.browser = p;
        this.headers = [];
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
        this.headers['Authorization'] = this.token_type + ' ' + this.access_token;
    }

    isStillAuthenticated(response){
        if(response.statusCode === 401 && 'application/problem+json' === response.headers['content-type']){
            // noinspection JSIgnoredPromiseFromCall
            this.getAccessToken();

        }

        return response;
    }

    async get(path, headers = {}) {
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