const apiVideo = require('../lib');
const expect = require('chai').expect;

describe('Players ressource', () => {
  describe('create', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        "shapeMargin": 10,
        "shapeRadius": 3,
        "shapeAspect": "flat",
        "shapeBackgroundTop": "rgba(50, 50, 50, .7)",
        "shapeBackgroundBottom": "rgba(50, 50, 50, .8)",
        "text": "rgba(255, 255, 255, .95)",
        "link": "rgba(255, 0, 0, .95)",
        "linkHover": "rgba(255, 255, 255, .75)",
        "linkActive": "rgba(255, 0, 0, .75)",
        "trackPlayed": "rgba(255, 255, 255, .95)",
        "trackUnplayed": "rgba(255, 255, 255, .1)",
        "trackBackground": "rgba(0, 0, 0, 0)",
        "backgroundTop": "rgba(72, 4, 45, 1)",
        "backgroundBottom": "rgba(94, 95, 89, 1)",
        "backgroundText": "rgba(255, 255, 255, .95)",
        "language": "en",
        "enableApi": true,
        "enableControls": true,
        "forceAutoplay": false,
        "hideTitle": false,
        "forceLoop": false
      };
      client.players.create(properties).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players',
        method: 'POST',
        headers: {},
        body: properties,
        json: true
      });
    });
  });

  describe('update', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        "shapeMargin": 10,
        "shapeRadius": 3,
        "shapeAspect": "flat",
        "shapeBackgroundTop": "rgba(50, 50, 50, .7)",
        "shapeBackgroundBottom": "rgba(50, 50, 50, .8)",
        "text": "rgba(255, 255, 255, .95)",
        "link": "rgba(255, 0, 0, .95)",
        "linkHover": "rgba(255, 255, 255, .75)",
        "linkActive": "rgba(255, 0, 0, .75)",
        "trackPlayed": "rgba(255, 255, 255, .95)",
        "trackUnplayed": "rgba(255, 255, 255, .1)",
        "trackBackground": "rgba(0, 0, 0, 0)",
        "backgroundTop": "rgba(72, 4, 45, 1)",
        "backgroundBottom": "rgba(94, 95, 89, 1)",
        "backgroundText": "rgba(255, 255, 255, .95)",
        "language": "en",
        "enableApi": true,
        "enableControls": true,
        "forceAutoplay": false,
        "hideTitle": true,
        "forceLoop": true
      };
      client.players.update('plx1x1x1x1x1x1x1x1x1x', properties).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.players.get('plx1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search with parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {
        currentPage : 1,
        pageSize: 25
      };
      client.players.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search without parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {};
      client.players.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.players.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/players?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  // Disabled test because endpoint not exist yet
  // describe('delete', () => {
  //   it('Sends good request', (done) => {
  //     const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
  //     client.players.delete('plx1x1x1x1x1x1x1x1x1x').catch((error) => {
  //       console.log(error.message || error.body);
  //     });
  //     expect(client.players.browser.lastRequest).to.deep.equal({
  //       url: 'https://ws.api.video/players/plx1x1x1x1x1x1x1x1x1x',
  //       method: 'DELETE',
  //       headers: {},
  //       json: true
  //     });
  //   });
  // });

  describe('cast', () => {
    it('Should return player object', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let data = {
        playerId: 'plx1x1x1x1x1x1x1x1x1x',
        shapeMargin: 10,
        shapeRadius: 3,
        shapeAspect: "flat",
        shapeBackgroundTop: "rgba(50, 50, 50, .7)",
        shapeBackgroundBottom: "rgba(50, 50, 50, .8)",
        text: "rgba(255, 255, 255, .95)",
        link: "rgba(255, 0, 0, .95)",
        linkHover: "rgba(255, 255, 255, .75)",
        linkActive: "rgba(255, 0, 0, .75)",
        trackPlayed: "rgba(255, 255, 255, .95)",
        trackUnplayed: "rgba(255, 255, 255, .1)",
        trackBackground: "rgba(0, 0, 0, 0)",
        backgroundTop: "rgba(72, 4, 45, 1)",
        backgroundBottom: "rgba(94, 95, 89, 1)",
        backgroundText: "rgba(255, 255, 255, .95)",
        language: "fr",
        enableApi: true,
        enableControls: true,
        forceAutoplay: false,
        hideTitle: false,
        forceLoop: false
      };
      let player = client.players.cast(data);
      expect(player).to.deep.equal(data);
    });
  });

});
