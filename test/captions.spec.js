const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');
const Caption = require('../lib/Model/caption');
const { ITEMS_TOTAL } = require('./api');

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
  });

  describe('updateDefault', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      const language = 'en';
      await client.captions.updateDefault(videoId, language, true);
    });
  });

  describe('get', () => {
    it('Returns a caption', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const caption = await client.captions.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(caption).to.be.an('object');
      expect(caption).to.have.keys(new Caption());
    });
  });

  describe('getAll', () => {
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
