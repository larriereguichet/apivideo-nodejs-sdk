const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');
const Chapter = require('../lib/Model/chapter');
const { ITEMS_TOTAL } = require('./api');

describe('Chapters ressource', () => {
  describe('Upload', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/en.vtt');
      const properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en',
      };
      await client.chapters.upload(source, properties).catch(() => {});
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/en.vtt');
      const properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en',
      };
      client.chapters.upload(source, properties).catch(() => {});
      expect(client.chapters.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en');
      expect(client.chapters.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.chapters.browser.lastRequest).to.deep.property('headers', {});
      expect(client.chapters.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.get('vix1x1x1x1x1x1x1x1x1x', 'en').catch(() => {});
      expect(client.chapters.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Returns a chapter', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const chapter = await client.chapters.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(chapter).to.be.an('object');
      expect(chapter).to.have.keys('language', 'src', 'uri');
    });
  });

  describe('getAll', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.getAll('vix1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.chapters.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/chapters?currentPage=1&pageSize=100',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Returns an array of chapters', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const chapters = await client.chapters.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(chapters).to.be.an('array');
      chapters.forEach(chapter => expect(chapter).to.have.keys(new Chapter()));
    });

    it('Returns all chapters', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const chapters = await client.chapters.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(chapters).to.have.lengthOf(ITEMS_TOTAL);
    });
  });

  describe('delete', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      await client.chapters.delete('vix1x1x1x1x1x1x1x1x1x', 'en');
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.chapters.delete('vix1x1x1x1x1x1x1x1x1x', 'en').catch(() => {});
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
