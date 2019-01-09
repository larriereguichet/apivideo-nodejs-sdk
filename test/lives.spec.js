const apiVideo = require('../lib');
const path = require('path');
var expect = require('chai').expect;

describe('Lives ressource', () => {
  describe('create', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let name = 'Live test';
      let properties = {
        record: false
      };
      client.lives.create(name, properties);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams',
        method: 'POST',
        headers: {},
        body: { record: false, name: 'Live test' },
        json: true
      });
    });
  });

  describe('update', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        record: true
      };
      client.lives.update('lix1x1x1x1x1x1x1x1x1x', properties);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: { record: true },
        json: true
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.lives.get('lix1x1x1x1x1x1x1x1x1x');
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
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
      client.lives.search(parameters);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams?currentPage=1&pageSize=25',
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
      client.lives.search(parameters);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Upload thumbnail', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let source = path.join(__dirname, 'data/test.png');
      let liveId = 'lix1x1x1x1x1x1x1x1x1x';
      client.lives.uploadThumbnail(source, liveId);
      expect(client.lives.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x/thumbnail');
      expect(client.lives.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.lives.browser.lastRequest).to.deep.property('headers', {});
      expect(client.lives.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('delete', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.lives.delete('lix1x1x1x1x1x1x1x1x1x');
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
        method: 'DELETE',
        headers: {},
        json: true
      });
    });
  });

  describe('cast', () => {
    it('Should return live object', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let data = {
        liveStreamId: 'lix1x1x1x1x1x1x1x1x1x',
        streamKey: '6xx3x5x2-2x2x-468x-906x-xx3xx9xx79x7',
        name: 'Live test',
        record: true,
        broadcasting: false,
        assets: {
          "iframe": "<iframe src=\"https://embed.api.video/live/lix1x1x1x1x1x1x1x1x1x\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\"></iframe>",
          "player": "https://embed.api.video/live/lix1x1x1x1x1x1x1x1x1x",
          "hls": "https://live.api.video/live/lix1x1x1x1x1x1x1x1x1x.m3u8",
          "thumbnail": "https://cdn.api.video/live/lix1x1x1x1x1x1x1x1x1x/thumbnail.jpg"
        }
      };
      let live = client.lives.cast(data);
      expect(live).to.deep.equal(data);
    });
  });

});
