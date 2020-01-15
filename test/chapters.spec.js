const path = require('path');
const expect = require('chai').expect;
const apiVideo = require('../lib');

describe('Chapters ressource', () => {
  describe('Upload', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/en.vtt');
      const properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en',
      };
      client.chapters.upload(source, properties);
      expect(client.chapters.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en');
      expect(client.chapters.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.chapters.browser.lastRequest).to.deep.property('headers', {});
      expect(client.chapters.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(client.chapters.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('getAll', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(client.chapters.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('delete', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.delete('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(client.chapters.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en',
        method: 'DELETE',
        headers: {},
        json: true,
      });
    });
  });

  describe('cast', () => {
    it('Should return chapter object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        uri: '/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en',
        src: 'https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/chapters/en.vtt',
        language: 'en',
      };
      const chapter = client.chapters.cast(data);
      expect(chapter).to.deep.equal(data);
    });
  });

});
