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
  });

  describe('get', () => {
    it('Returns a chapter', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const chapter = await client.chapters.get('vix1x1x1x1x1x1x1x1x1x', 'en');
      expect(chapter).to.be.an('object');
      expect(chapter).to.have.keys('language', 'src', 'uri');
    });
  });

  describe('getAll', () => {
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
