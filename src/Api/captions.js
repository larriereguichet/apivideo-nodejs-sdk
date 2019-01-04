const Caption = require('../Model/caption');
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const http_build_query = require('locutus/php/url/http_build_query');
const fs = require('fs');

let Captions = function(browser) {
  this.browser = browser;

  this.get = async function(videoId, language) {
    let that = this;
    let response = await this.browser.get('/videos/' + videoId + '/captions/' + language);

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let caption = that.cast(response.body);
        resolve(caption);
      }
    }).catch(function(e) {
      console.log(e.statusCode);
    });
  };

  this.getAll = async function(videoId) {
    let that = this;
    let response = await this.browser.get('/videos/' + videoId + '/captions');

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let captions = that.castAll(response.body);
        resolve(captions);
      }
    }).catch(function(e) {
      console.log(e.statusCode);
    });
  };

  this.upload = async function (source, properties = {}) {
    let that = this;

    if(!fs.existsSync(source)){
      throw source + ' must be a readable source file';
    }

    if(typeof properties.videoId === 'undefined'){
      throw '"videoId" property must be set for upload caption.';
    }

    if(typeof properties.language === 'undefined'){
      throw '"language" property must be set for upload caption.';
    }

    let videoId = properties.videoId;
    let language = properties.language;


    let length = fs.statSync(source).size;
    console.log('File size to upload '+length);

    if(0 >= length){
      throw  source + 'is empty';
    }

    let response = await this.browser.submit(
        '/videos/' + videoId + '/captions/' + language,
        source
    );

    return new Promise(function (resolve, reject) {
      if(!that.browser.isSuccessfull(response)){
        reject(response);
      }else{
        let caption = that.cast(response.body);
        resolve(caption);
      }
    }).catch(function (error) {
      console.log(error);
    });
  };

  this.updateDefault = async function(videoId, language, isDefault) {
    let that = this;
    let response = await this.browser.patch(
        '/videos/' + videoId + '/captions/' + language,
        {},
        {default: isDefault},
    );

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let caption = that.cast(response.body);
        resolve(caption);
      }
    });
  };

  this.delete = async function(videoId, language) {
    let that = this;

    let response = await this.browser.delete('/videos/' + videoId + '/captions/' + language);

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        resolve(response.statusCode);
      }
    });
  };
};

Captions.prototype.castAll = function(collection) {
  return array_map(function(data) {
    let caption = new Caption();
    caption.uri = data.uri;
    caption.src = data.src;
    caption.srclang = data.srclang;
    caption.default = data.default;

    return caption;
  }, collection);
};

Captions.prototype.cast = function(data) {
  if (!data) {
    return null;
  }
  let caption = new Caption();
  caption.uri = data.uri;
  caption.src = data.src;
  caption.srclang = data.srclang;
  caption.default = data.default;

  return caption;
};

module.exports = Captions;