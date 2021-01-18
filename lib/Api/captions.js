const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const Caption = require('../Model/caption');

const Captions = function Captions(browser) {
  this.browser = browser;

  this.get = async function get(videoId, language) {
    const that = this;
    const response = await this.browser.get(
      `/videos/${videoId}/captions/${language}`,
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const caption = that.cast(response.body);
        resolve(caption);
      }
    }));
  };

  this.getAll = async function getAll(videoId) {
    const params = { currentPage: 1, pageSize: 100 };
    const allCaptions = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
        `/videos/${videoId}/captions?${querystring.stringify(params)}`,
      );

      if (!this.browser.isSuccessfull(response)) {
        return Promise.reject(response);
      }

      const results = response.body;
      const captions = results.data;
      allCaptions.push(this.castAll(captions));

      ({ pagination } = results);
      pagination.currentPage += 1;
      params.currentPage = pagination.currentPage;
    } while (pagination.pagesTotal >= pagination.currentPage);

    return Promise.resolve(allCaptions.reduce((players, payersPage) => players.concat(payersPage)));
  };

  this.upload = async function upload(source, properties = {}) {
    const that = this;

    if (!fs.existsSync(source)) {
      throw new Error(`${source} must be a readable source file`);
    }

    if (typeof properties.videoId === 'undefined') {
      throw new Error('"videoId" property must be set for upload caption.');
    }

    if (typeof properties.language === 'undefined') {
      throw new Error('"language" property must be set for upload caption.');
    }

    const { videoId } = properties;
    const { language } = properties;

    const length = fs.statSync(source).size;

    if (length <= 0) {
      throw new Error(`${source} is empty`);
    }

    const response = await this.browser.submit(
      `/videos/${videoId}/captions/${language}`,
      source,
      path.basename(source),
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const caption = that.cast(response.body);
        resolve(caption);
      }
    }));
  };

  this.updateDefault = async function updateDefault(videoId, language, isDefault) {
    const that = this;
    const response = await this.browser.patch(
      `/videos/${videoId}/captions/${language}`,
      {},
      { default: isDefault },
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const caption = that.cast(response.body);
        resolve(caption);
      }
    }));
  };

  this.delete = async function remove(videoId, language) {
    const that = this;

    const response = await this.browser.delete(
      `/videos/${videoId}/captions/${language}`,
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        resolve(response.statusCode);
      }
    }));
  };
};

Captions.prototype.castAll = function castAll(collection) {
  return collection.map(Captions.prototype.cast);
};

Captions.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const caption = new Caption();
  caption.uri = data.uri;
  caption.src = data.src;
  caption.srclang = data.srclang;
  caption.default = data.default;

  return caption;
};

module.exports = Captions;
