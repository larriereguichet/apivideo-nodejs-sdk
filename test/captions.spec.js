const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');
const Caption = require('../lib/Model/caption');
const { ITEMS_TOTAL } = require('./api');
const { version } = require('../package.json');

describe('Captions ressource', () => {
  describe('Upload', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/en.vtt');
      const properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en',
      };
      await client.captions.upload(source, properties);
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/en.vtt');
      const properties = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        language: 'en',
      };
      client.captions.upload(source, properties).catch(() => {});
      expect(client.captions.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en');
      expect(client.captions.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.captions.browser.lastRequest).to.deep.property('headers', {'User-Agent': `api.video SDK (nodejs; v:${version})`});
      expect(client.captions.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('updateDefault', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      const language = 'en';
      await client.captions.updateDefault(videoId, language, true);
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      const language = 'en';
      client.captions.updateDefault(videoId, language, true).catch(() => {});
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'PATCH',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        body: { default: true },
        json: true,
      });
    });
  });

  describe('get', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.captions.get('vix1x1x1x1x1x1x1x1x1x', 'en').catch(() => {});
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'GET',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });

    it('Returns a caption', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const caption = await client.captions.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(caption).to.be.an('object');
      expect(caption).to.have.keys(new Caption());
    });
  });

  describe('getAll', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.captions.getAll('vix1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions?currentPage=1&pageSize=100',
        method: 'GET',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });

    it('Returns an array of captions', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const captions = await client.captions.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(captions).to.be.an('array');
      captions.forEach(caption => expect(caption).to.have.keys(new Caption()));
    });

    it('Returns all captions', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const captions = await client.captions.getAll('vix1x1x1x1x1x1x1x1x1x');
      expect(captions).to.have.lengthOf(ITEMS_TOTAL);
    });
  });

  describe('delete', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.captions.delete('vix1x1x1x1x1x1x1x1x1x', 'en');
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.captions.delete('vix1x1x1x1x1x1x1x1x1x', 'en').catch(() => {});
      expect(client.captions.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        method: 'DELETE',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });
  });

  describe('cast', () => {
    it('Should return caption object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        uri: '/videos/vix1x1x1x1x1x1x1x1x1x/captions/en',
        src: 'https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/token/1390f745-a267-493b-8a2d-a8ea0e017042/captions/en.vtt',
        srclang: 'en',
        default: true,
      };
      const caption = client.captions.cast(data);
      expect(caption).to.deep.equal(data);
    });
  });
});
