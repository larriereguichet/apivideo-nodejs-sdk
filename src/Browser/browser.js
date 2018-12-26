const p = require('phin');
const helper = require('../Utils/helper');

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
        console.log(response.headers['content-type']);
    }

    isStillAuthenticated(response){
        if(response.statusCode === 401 && 'application/problem+json' === response.headers['content-type'] && response.body.indexOf('access_denied') !== -1){
            this.lastRequest = response.req;
            console.log(this.lastRequest);
            // noinspection JSIgnoredPromiseFromCall
            this.getAccessToken();

        }

        return response;
    }

    get(path, headers = {}){
        return this.isStillAuthenticated(
            this.browser({
                url: this.baseUri + path,
                method: 'GET',
                headers: extend(this.headers, headers),
                parse: 'json'
            })
        )
    }

    static isSuccessfull(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
    }
}

module.exports = Browser;