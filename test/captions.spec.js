const apiVideo = require('../lib');
const path = require('path');
var expect = require('chai').expect;

describe('Captions ressource', () => {
  describe('Upload', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let source = path.join(__dirname, 'data/en.vtt');
      let properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en'
      };
      client.captions.upload(source, properties);
      expect(client.captions.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en');
      expect(client.captions.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.captions.browser.lastRequest).to.deep.property('headers', {});
      expect(client.captions.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('updateDefault', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let videoId = 'vix1x1x1x1x1x1x1x1x1x';
      let language = 'en';
      client.captions.updateDefault(videoId, language, true);
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'PATCH',
        headers: {},
        body: { default: true },
        json: true
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.captions.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('getAll', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.captions.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('delete', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.captions.delete('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'DELETE',
        headers: {},
        json: true
      });
    });
  });

  describe('cast', () => {
    it('Should return caption object', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let data = {
        uri: '/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        src: 'https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/token/1390f745-a267-493b-8a2d-a8ea0e017042/captions/en.vtt',
        srclang: "en",
        default: true
      };
      let caption = client.captions.cast(data);
      expect(caption).to.deep.equal(data);
    });
  });

});
