const querystring = require('querystring');
const AnalyticVideo = require('../Model/Analytic/analyticVideo');
const AnalyticData = require('../Model/Analytic/analyticData');

const AnalyticsVideo = function AnalyticsVideo(browser) {
  this.browser = browser;

  this.get = async function get(videoId, period = null) {
    const that = this;
    const parameters = { currentPage: 1, pageSize: 100 };
    if (period) {
      parameters.period = period;
    }

    const allAnalytics = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
        `/analytics/videos/${videoId}?${querystring.stringify(parameters)}`,
      );

      if (that.browser.isSuccessfull(response)) {
        const results = response.body;
        const analytics = results.data;
        allAnalytics.push(that.castAll(analytics));

        ({ pagination } = results);
        pagination.currentPage += 1;
        parameters.currentPage = pagination.currentPage;
      }
    } while (pagination.pagesTotal >= pagination.currentPage);

    return new Promise((async (resolve, reject) => {
      try {
        const analyticVideo = new AnalyticVideo();
        analyticVideo.videoId = videoId;
        analyticVideo.period = parameters.period;
        analyticVideo.data = allAnalytics.reduce(
          (analytics, analyticsPage) => analytics.concat(analyticsPage),
        );

        resolve(analyticVideo);
      } catch (e) {
        reject(e);
      }
    }));
  };

  this.search = async function search(parameters = {}) {
    const that = this;
    const params = Object.assign({}, parameters);
    const currentPage = (typeof parameters.currentPage !== 'undefined')
      ? parameters.currentPage
      : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
      ? parameters.pageSize
      : 100;

    params.currentPage = currentPage;

    const allAnalytics = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
        `/analytics/videos?${querystring.stringify(params)}`,
      );

      if (this.browser.isSuccessfull(response)) {
        const results = response.body;
        const analytics = results.data;
        allAnalytics.push(that.castAll(analytics));

        if (typeof parameters.currentPage !== 'undefined') {
          break;
        }

        ({ pagination } = results);
        pagination.currentPage += 1;
        params.currentPage = pagination.currentPage;
      }
    } while (pagination.pagesTotal >= pagination.currentPage);

    return new Promise((async (resolve, reject) => {
      try {
        resolve(allAnalytics.reduce((analytics, analyticsPage) => analytics.concat(analyticsPage)));
      } catch (e) {
        reject(e);
      }
    }));
  };
};

AnalyticsVideo.prototype.castAll = function castAll(collection) {
  return collection.map(AnalyticsVideo.prototype.cast);
};

AnalyticsVideo.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  const analyticData = new AnalyticData();
  // Build Analytic Session
  analyticData.session.sessionId = data.session.sessionId;
  analyticData.session.loadedAt = new Date(data.session.loadedAt);
  analyticData.session.endedAt = new Date(data.session.endedAt);

  // Build Analytic Location
  analyticData.location.country = data.location.country;
  analyticData.location.city = data.location.city;

  // Build Analytic Referer
  analyticData.referer.url = data.referrer.url;
  analyticData.referer.medium = data.referrer.medium;
  analyticData.referer.source = data.referrer.source;
  analyticData.referer.search_term = data.referrer.searchTerm;

  // Build Analytic Device
  analyticData.device.type = data.device.type;
  analyticData.device.vendor = data.device.vendor;
  analyticData.device.model = data.device.model;

  // Build Analytic Os
  analyticData.os.name = data.os.name;
  analyticData.os.shortname = data.os.shortname;
  analyticData.os.version = data.os.version;

  // Build Analytic Client
  analyticData.client.type = data.client.type;
  analyticData.client.name = data.client.name;
  analyticData.client.version = data.client.version;

  return analyticData;
};

module.exports = AnalyticsVideo;
