const apiVideo = require('../lib');
const Videos = require('../lib/Api/videos');
const Lives = require('../lib/Api/lives');
const Players = require('../lib/Api/players');
const Captions = require('../lib/Api/captions');
const Tokens = require('../lib/Api/tokens');
const AnalyticsVideo = require('../lib/Api/analyticsVideo');
const AnalyticsLive = require('../lib/Api/analyticsLive');
const fs = require('fs');
const path = require('path');
var expect = require('chai').expect;

describe('Videos ressource', () => {
  describe('create', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let title = 'Video test';
      let properties = {
        description: 'Video test'
      };
      client.videos.create(title, properties);
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos',
        method: 'POST',
        headers: {},
        body: { description: 'Video test', title: 'Video test' },
        json: true
      });
    });
  });

  describe('update', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        description: 'Video test 2',
        tag: ['test1', 'test2']
      };
      client.videos.update('vix1x1x1x1x1x1x1x1x1x', properties);
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: { description: 'Video test 2', tag: ['test1', 'test2'] },
        json: true
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.videos.get('vix1x1x1x1x1x1x1x1x1x');
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
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
      client.videos.search(parameters);
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos?currentPage=1&pageSize=25',
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
      client.videos.search(parameters);
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Download', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let source = 'https://www.example.com/video.mp4';
      let title = 'Video test';
      let properties = {
        description: 'Video test'
      };
      client.videos.download(source, title, properties);
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos',
        method: 'POST',
        headers: {},
        body: { description: properties.description, title: title, source: source },
        json: true
      });
    });
  });

  describe('Upload', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let source = path.join(__dirname, 'data/small.webm');
      let videoId = 'vix1x1x1x1x1x1x1x1x1x';
      client.videos.upload(source, {}, videoId);
      expect(client.videos.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/source');
      expect(client.videos.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.videos.browser.lastRequest).to.deep.property('headers', {});
      expect(client.videos.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('Upload thumbnail', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let source = path.join(__dirname, 'data/test.png');
      let videoId = 'vix1x1x1x1x1x1x1x1x1x';
      client.videos.uploadThumbnail(source, videoId);
      expect(client.videos.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail');
      expect(client.videos.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.videos.browser.lastRequest).to.deep.property('headers', {});
      expect(client.videos.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('makePublic', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        public: true
      };
      client.videos.makePublic('vix1x1x1x1x1x1x1x1x1x');
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true
      });
    });
  });

  describe('makePrivate', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        public: false
      };
      client.videos.makePrivate('vix1x1x1x1x1x1x1x1x1x');
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true
      });
    });
  });

  describe('updateThumbnailWithTimecode', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let properties = {
        timecode: '00:10:05.02'
      };
      client.videos.updateThumbnailWithTimecode('vix1x1x1x1x1x1x1x1x1x', '00:10:05.02');
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true
      });
    });
  });

  describe('delete', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.videos.delete('vix1x1x1x1x1x1x1x1x1x');
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'DELETE',
        headers: {},
        json: true
      });
    });
  });

  describe('cast', () => {
    it('Should return video object', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let data = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        title: 'Video test',
        description: 'Video test',
        public: true,
        tags: [],
        metadata: [],
        source: {
          type: 'upload',
          uri: '/videos/vix1x1x1x1x1x1x1x1x1x/source'
        },
        publishedAt: '2019-01-01T00:00:00+02:00',
        captions: {},
        assets: {
          "iframe": "<iframe src=\"https://embed.api.video/vod/vix1x1x1x1x1x1x1x1x1x\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"\"></iframe>",
          "player": "https://embed.api.video/vod/vix1x1x1x1x1x1x1x1x1x",
          "hls": "https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/hls/manifest.m3u8",
          "thumbnail": "https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/thumbnail.jpg"
        }
      };
      let video = client.videos.cast(data);
      expect(video).to.deep.equal(data);
    });
  });

});
