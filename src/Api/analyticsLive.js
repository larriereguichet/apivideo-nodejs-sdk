const AnalyticLive = require('../Model/Analytic/analyticLive');
const AnalyticData = require('../Model/Analytic/analyticData');
const AnalyticEvent = require('../Model/Analytic/analyticEvent');
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const http_build_query = require('locutus/php/url/http_build_query');

let AnalyticsLive = function (browser) {

  this.browser = browser;

  this.get = async function (liveStreamId, period = null) {
    let that = this;
    let parameters = {};
    if (period) {
      parameters.period = period;
    }
    let response = await this.browser.get('/analytics/live-streams/' + liveStreamId + '?' + http_build_query(parameters));
    return new Promise(function (resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let analyticLive = that.cast(response.body);
        resolve(analyticLive);
      }
    }).catch(function (e) {
      console.log(e.statusCode);
    });
  };

  this.search = async function (parameters = {}) {
    let that = this;
    let params = parameters;
    let currentPage = (typeof parameters.currentPage !== 'undefined')
      ? parameters.currentPage
      : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
      ? parameters.pageSize
      : 100;

    params.currentPage = currentPage;

    let allAnalytics = [];
    let pagination = {};
    do {
      let response = await this.browser.get(
        '/analytics/live-streams?' + http_build_query(params));

      if (that.browser.isSuccessfull(response)) {
        let results = response.body;
        let analytics = results.data;
        allAnalytics.push(that.castAll(analytics));

        if (typeof parameters.currentPage !== 'undefined') {
          break;
        }

        pagination = results.pagination;
        pagination.currentPage++;
        params.currentPage = pagination.currentPage;
      }

    } while (pagination.pagesTotal > pagination.currentPage);

    return new Promise(async function (resolve, reject) {
      try {
        let analytics = [];
        if (allAnalytics.hasOwnProperty(0)) {
          analytics = allAnalytics[0];
        }
        for (let x = 1; x < allAnalytics.length; x++) {
          if (allAnalytics.hasOwnProperty(x)) {
            array_merge(analytics, allAnalytics[x]);
          }
        }
        resolve(analytics);
      } catch (e) {
        reject(e);
      }
    });
  };
};

AnalyticsLive.prototype.castAll = function (collection) {
  let that = this;
  return array_map(function (data) {
    let analyticLive = new AnalyticLive();
    analyticLive.liveStreamId = data.live.live_stream_id;
    analyticLive.liveName = data.live.name;
    analyticLive.period = data.period;
    // Build Analytic Data
    for (let key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        let playerSession = data.data[key];
        let analyticData = new AnalyticData();

        // Build Analytic Session
        analyticData.session.sessionId = playerSession.session.sessionId;
        analyticData.session.loadedAt = new Date(playerSession.session.loadedAt);
        analyticData.session.endedAt = new Date(playerSession.session.endedAt);

        // Build Analytic Location
        analyticData.location.country = playerSession.location.country;
        analyticData.location.city = playerSession.location.city;

        // Build Analytic Referer
        analyticData.referer.url = playerSession.referrer.url;
        analyticData.referer.medium = playerSession.referrer.medium;
        analyticData.referer.source = playerSession.referrer.source;
        analyticData.referer.search_term = playerSession.referrer.search_term;

        // Build Analytic Device
        analyticData.device.type = playerSession.device.type;
        analyticData.device.vendor = playerSession.device.vendor;
        analyticData.device.model = playerSession.device.model;

        // Build Analytic Os
        analyticData.os.name = playerSession.os.name;
        analyticData.os.shortname = playerSession.os.shortname;
        analyticData.os.version = playerSession.os.version;

        // Build Analytic Client
        analyticData.client.type = playerSession.client.type;
        analyticData.client.name = playerSession.client.name;
        analyticData.client.version = playerSession.client.version;

        // Build Analytic Events
        analyticData.events = that.buildAnalyticEventsData(playerSession.events);

        analyticLive.data.push(analyticData);
      }
    }

    return analyticLive;
  }, collection);
};

AnalyticsLive.prototype.cast = function (data) {
  if (!data) {
    return null;
  }

  let analyticLive = new AnalyticLive();
  analyticLive.liveStreamId = data.live.live_stream_id;
  analyticLive.liveName = data.live.name;
  analyticLive.period = data.period;
  // Build Analytic Data
  for (let key in data.data) {
    if (data.data.hasOwnProperty(key)) {
      let playerSession = data.data[key];
      let analyticData = new AnalyticData();

      // Build Analytic Session
      analyticData.session.sessionId = new Date(playerSession.session.sessionId);
      analyticData.session.loadedAt = new Date(playerSession.session.loadedAt);
      analyticData.session.endedAt = playerSession.session.endedAt;

      // Build Analytic Location
      analyticData.location.country = playerSession.location.country;
      analyticData.location.city = playerSession.location.city;

      // Build Analytic Referer
      analyticData.referer.url = playerSession.referrer.url;
      analyticData.referer.medium = playerSession.referrer.medium;
      analyticData.referer.source = playerSession.referrer.source;
      analyticData.referer.search_term = playerSession.referrer.search_term;

      // Build Analytic Device
      analyticData.device.type = playerSession.device.type;
      analyticData.device.vendor = playerSession.device.vendor;
      analyticData.device.model = playerSession.device.model;

      // Build Analytic Os
      analyticData.os.name = playerSession.os.name;
      analyticData.os.shortname = playerSession.os.shortname;
      analyticData.os.version = playerSession.os.version;

      // Build Analytic Client
      analyticData.client.type = playerSession.client.type;
      analyticData.client.name = playerSession.client.name;
      analyticData.client.version = playerSession.client.version;

      // Build Analytic Events
      analyticData.events = this.buildAnalyticEventsData(playerSession.events);

      analyticLive.data.push(analyticData);
    }
  }

  return analyticLive;
};

AnalyticsLive.prototype.buildAnalyticEventsData = function (events) {
  let eventsBuilded = [];

  for(let key in events){
    if(events.hasOwnProperty(key)){
      let event = events[key];
      let analyticEvent = new AnalyticEvent();

      analyticEvent.type = event.type;
      analyticEvent.emittedAt = new Date(event.emitted_at);
      analyticEvent.at = (typeof event.at !== 'undefined') ? event.at : null;
      analyticEvent.from = (typeof event.from !== 'undefined') ? event.from : null;
      analyticEvent.to = (typeof event.to !== 'undefined') ? event.to : null;

      eventsBuilded.push(analyticEvent);
    }
  }

  return eventsBuilded;
};

module.exports = AnalyticsLive;