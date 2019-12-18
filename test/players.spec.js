const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');

describe('Players ressource', () => {
  describe('create', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        shapeMargin: 10,
        shapeRadius: 3,
        shapeAspect: 'flat',
        shapeBackgroundTop: 'rgba(50, 50, 50, .7)',
        shapeBackgroundBottom: 'rgba(50, 50, 50, .8)',
        text: 'rgba(255, 255, 255, .95)',
        link: 'rgba(255, 0, 0, .95)',
        linkHover: 'rgba(255, 255, 255, .75)',
        linkActive: 'rgba(255, 0, 0, .75)',
        trackPlayed: 'rgba(255, 255, 255, .95)',
        trackUnplayed: 'rgba(255, 255, 255, .1)',
        trackBackground: 'rgba(0, 0, 0, 0)',
        backgroundTop: 'rgba(72, 4, 45, 1)',
        backgroundBottom: 'rgba(94, 95, 89, 1)',
        backgroundText: 'rgba(255, 255, 255, .95)',
        language: 'en',
        enableApi: true,
        enableControls: true,
        forceAutoplay: false,
        hideTitle: false,
        forceLoop: false,
      };
      client.players.create(properties).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players',
        method: 'POST',
        headers: {},
        body: properties,
        json: true,
      });
    });
  });

  describe('update', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        shapeMargin: 10,
        shapeRadius: 3,
        shapeAspect: 'flat',
        shapeBackgroundTop: 'rgba(50, 50, 50, .7)',
        shapeBackgroundBottom: 'rgba(50, 50, 50, .8)',
        text: 'rgba(255, 255, 255, .95)',
        link: 'rgba(255, 0, 0, .95)',
        linkHover: 'rgba(255, 255, 255, .75)',
        linkActive: 'rgba(255, 0, 0, .75)',
        trackPlayed: 'rgba(255, 255, 255, .95)',
        trackUnplayed: 'rgba(255, 255, 255, .1)',
        trackBackground: 'rgba(0, 0, 0, 0)',
        backgroundTop: 'rgba(72, 4, 45, 1)',
        backgroundBottom: 'rgba(94, 95, 89, 1)',
        backgroundText: 'rgba(255, 255, 255, .95)',
        language: 'en',
        enableApi: true,
        enableControls: true,
        forceAutoplay: false,
        hideTitle: true,
        forceLoop: true,
      };
      client.players.update('plx1x1x1x1x1x1x1x1x1x', properties).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true,
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.players.get('plx1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Search with parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      client.players.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Search without parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {};
      client.players.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('Upload logo', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/test.png');
      const playerId = 'plx1x1x1x1x1x1x1x1x1x';
      const link = 'https://api.video';
      client.players.uploadLogo(source, playerId, link).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x/logo');
      expect(client.players.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.players.browser.lastRequest).to.deep.property('headers', {});
      expect(client.players.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('delete', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.players.delete('plx1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
        method: 'DELETE',
        headers: {},
        json: true,
      });
    });
  });

  describe('cast', () => {
    it('Should return player object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        playerId: 'plx1x1x1x1x1x1x1x1x1x',
        shapeMargin: 10,
        shapeRadius: 3,
        shapeAspect: 'flat',
        shapeBackgroundTop: 'rgba(50, 50, 50, .7)',
        shapeBackgroundBottom: 'rgba(50, 50, 50, .8)',
        text: 'rgba(255, 255, 255, .95)',
        link: 'rgba(255, 0, 0, .95)',
        linkHover: 'rgba(255, 255, 255, .75)',
        linkActive: 'rgba(255, 0, 0, .75)',
        trackPlayed: 'rgba(255, 255, 255, .95)',
        trackUnplayed: 'rgba(255, 255, 255, .1)',
        trackBackground: 'rgba(0, 0, 0, 0)',
        backgroundTop: 'rgba(72, 4, 45, 1)',
        backgroundBottom: 'rgba(94, 95, 89, 1)',
        backgroundText: 'rgba(255, 255, 255, .95)',
        language: 'fr',
        enableApi: true,
        enableControls: true,
        forceAutoplay: false,
        hideTitle: false,
        forceLoop: false,
        logo: {},
      };
      const player = client.players.cast(data);
      expect(player).to.deep.equal(data);
    });
  });
});
