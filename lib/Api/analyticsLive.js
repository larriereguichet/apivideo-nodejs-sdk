const querystring = require('querystring');
const AnalyticLive = require('../Model/Analytic/analyticLive');
const AnalyticData = require('../Model/Analytic/analyticData');
const AnalyticSession = require('../Model/Analytic/analyticSession');

const AnalyticsVideo = function AnalyticsVideo(browser) {
  this.browser = browser;

  this.get = async function get(liveStreamId, parameters= {}) {
    const that = this;
    const params = Object.assign({}, parameters);
    const currentPage = (typeof parameters.currentPage !== 'undefined')
        ? parameters.currentPage
        : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
        ? parameters.pageSize
        : 100;
    params.currentPage = currentPage;

    const allPlayerSessions = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
          `/analytics/live-streams/${liveStreamId}?${querystring.stringify(params)}`,
      );

      if (that.browser.isSuccessfull(response)) {
        const results = response.body;
        Array.prototype.push.apply(allPlayerSessions, results.data.map(playerSession => that.cast(playerSession)));

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
        const analyticVideo = new AnalyticVideo();
        analyticVideo.liveStreamId = liveStreamId;
        analyticVideo.period = parameters.period;
        analyticVideo.metadata = parameters.metadata;
        analyticVideo.data = allPlayerSessions;

        resolve(analyticVideo);
      } catch (e) {
        reject(e);
      }
    }));
  };

  this.search = async function search(parameters= {}) {
    const that = this;
    const params = Object.assign({}, parameters);
    const currentPage = (typeof parameters.currentPage !== 'undefined')
        ? parameters.currentPage
        : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
        ? parameters.pageSize
        : 100;
    params.currentPage = currentPage;

    const allPlayerSessions = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
          `/analytics/live-streams?${querystring.stringify(params)}`,
      );

      if (that.browser.isSuccessfull(response)) {
        const results = response.body;
        Array.prototype.push.apply(allPlayerSessions, results.data.map(playerSession => that.cast(playerSession)));

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
        const analyticVideo = new AnalyticVideo();
        analyticVideo.period = parameters.period;
        analyticVideo.data = allPlayerSessions;

        resolve(analyticVideo);
      } catch (e) {
        reject(e);
      }
    }));
  };
};

AnalyticsVideo.prototype.cast = function cast(playerSession) {
  if (!playerSession) {
    return null;
  }

  return Object.assign(
      new AnalyticData(),
      playerSession,
      {
        session: Object.assign(
            new AnalyticSession(),
            playerSession.session,
            {
              loadedAt: new Date(playerSession.session.loadedAt),
              endedAt: new Date(playerSession.session.endedAt),
            }
        )
      }
  )
};

module.exports = AnalyticsVideo;
