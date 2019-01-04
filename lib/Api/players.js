const Player = require('../Model/player');
const array_merge = require('locutus/php/array/array_merge');
const array_map = require('locutus/php/array/array_map');
const http_build_query = require('locutus/php/url/http_build_query');

let Players = function(browser) {
  this.browser = browser;

  this.get = async function(playerId) {
    let that = this;
    let response = await this.browser.get('/players/' + playerId);

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let player = that.cast(response.body);
        resolve(player);
      }
    }).catch(function(e) {
      console.log(e.statusCode);
    });
  };

  this.create = async function(properties = {}) {
    let that = this;
    let response = await this.browser.post(
        '/players',
        {},
        properties,
    );

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let player = that.cast(response.body);
        resolve(player);
      }
    });
  };

  this.search = async function(parameters = {}) {
    let that = this;
    let params = parameters;
    let currentPage = (typeof parameters.currentPage !== 'undefined') ?
        parameters.currentPage :
        1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined') ?
        parameters.pageSize :
        100;
    params.currentPage = currentPage;
    let allPlayers = [];
    let pagination = {};
    do {
      let response = await this.browser.get(
          '/players?' + http_build_query(params));

      if (that.browser.isSuccessfull(response)) {
        let results = response.body;
        let players = results.data;
        allPlayers.push(that.castAll(players));

        if (typeof parameters.currentPage !== 'undefined') {
          break;
        }

        pagination = results.pagination;
        pagination.currentPage++;
        params.currentPage = pagination.currentPage;
      }

    } while (pagination.pagesTotal > pagination.currentPage);

    return new Promise(async function(resolve, reject) {
      try {
        let players = [];
        if (allPlayers.hasOwnProperty(0)) {
          players = allPlayers[0];
        }
        for (let x = 1; x < allPlayers.length; x++) {
          if (allPlayers.hasOwnProperty(x)) {
            array_merge(players, allPlayers[x]);
          }
        }
        resolve(players);
      } catch (e) {
        reject(e);
      }
    });
  };

  this.update = async function(playerId, properties = {}) {
    let that = this;
    let response = await this.browser.patch(
        '/players/' + playerId,
        {},
        properties,
    );

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let player = that.cast(response.body);
        resolve(player);
      }
    });
  };

  this.delete = async function(playerId) {
    let that = this;

    let response = await this.browser.delete('/players/' + playerId);

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        resolve(response.statusCode);
      }
    });
  };
};

Players.prototype.castAll = function(collection) {
  return array_map(function(data) {
    let player = new Player();
    player.playerId = data.playerId;
    player.shapeMargin = data.shapeMargin;
    player.shapeRadius = data.shapeRadius;
    player.shapeAspect = data.shapeAspect;
    player.shapeBackgroundTop = data.shapeBackgroundTop;
    player.shapeBackgroundBottom = data.shapeBackgroundBottom;
    player.text = data.text;
    player.link = data.link;
    player.linkHover = data.linkHover;
    player.linkActive = data.linkActive;
    player.trackPlayed = data.trackPlayed;
    player.trackUnplayed = data.trackUnplayed;
    player.trackBackground = data.trackBackground;
    player.backgroundTop = data.backgroundTop;
    player.backgroundBottom = data.backgroundBottom;
    player.backgroundText = data.backgroundText;
    player.language = data.language;
    player.enableApi = data.enableApi;
    player.enableControls = data.enableControls;
    player.forceAutoplay = data.forceAutoplay;
    player.hideTitle = data.hideTitle;
    player.forceLoop = data.forceLoop;
    return player;
  }, collection);
};

Players.prototype.cast = function(data) {
  if (!data) {
    return null;
  }

  let player = new Player();
  player.playerId = data.playerId;
  player.shapeMargin = data.shapeMargin;
  player.shapeRadius = data.shapeRadius;
  player.shapeAspect = data.shapeAspect;
  player.shapeBackgroundTop = data.shapeBackgroundTop;
  player.shapeBackgroundBottom = data.shapeBackgroundBottom;
  player.text = data.text;
  player.link = data.link;
  player.linkHover = data.linkHover;
  player.linkActive = data.linkActive;
  player.trackPlayed = data.trackPlayed;
  player.trackUnplayed = data.trackUnplayed;
  player.trackBackground = data.trackBackground;
  player.backgroundTop = data.backgroundTop;
  player.backgroundBottom = data.backgroundBottom;
  player.backgroundText = data.backgroundText;
  player.language = data.language;
  player.enableApi = data.enableApi;
  player.enableControls = data.enableControls;
  player.forceAutoplay = data.forceAutoplay;
  player.hideTitle = data.hideTitle;
  player.forceLoop = data.forceLoop;

  return player;
};

module.exports = Players;