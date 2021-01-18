const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');
const { ITEMS_TOTAL } = require('./api');
const { version } = require('../package.json');

describe('Lives ressource', () => {
  describe('create', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const name = 'Live test';
      const properties = {
        record: false,
      };
      await client.lives.create(name, properties);
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const name = 'Live test';
      const properties = {
        record: false,
      };
      client.lives.create(name, properties).catch(() => {});
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams',
        method: 'POST',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        body: { record: false, name: 'Live test' },
        json: true,
      });
    });
  });

  describe('update', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        record: true,
      };
      await client.lives.update('lix1x1x1x1x1x1x1x1x1x', properties);
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        record: true,
      };
      client.lives.update('lix1x1x1x1x1x1x1x1x1x', properties).catch(() => {});
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        body: { record: true },
        json: true,
      });
    });
  });

  describe('get', async () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.lives.get('lix1x1x1x1x1x1x1x1x1x');
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
        method: 'GET',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });

    it('Returns a live-stream', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const live = await client.lives.get('lix1x1x1x1x1x1x1x1x1x');
      expect(live).to.have.property('liveStreamId');
    });
  });

  describe('Search first page', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      client.lives.search(parameters);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });

    it('Returns an array', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      const liveStreams = await client.lives.search(parameters);
      expect(liveStreams).to.be.an.instanceOf(Array);
    });

    it('Returns only one page', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      const liveStreams = await client.lives.search(parameters);
      expect(liveStreams).to.be.of.length(parameters.pageSize);
    });
  });

  describe('Search without parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {};
      client.lives.search(parameters);
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });

    it('Returns an array', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {};
      const liveStreams = await client.lives.search(parameters);
      expect(liveStreams).to.be.an.instanceOf(Array);
    });

    it('Returns all pages', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {};
      const liveStreams = await client.lives.search(parameters);
      expect(liveStreams).to.be.of.length(ITEMS_TOTAL); // default pageSize is 100
    });
  });

  describe('Upload thumbnail', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/test.png');
      const liveId = 'lix1x1x1x1x1x1x1x1x1x';
      await client.lives.uploadThumbnail(source, liveId);
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/test.png');
      const liveId = 'lix1x1x1x1x1x1x1x1x1x';
      client.lives.uploadThumbnail(source, liveId).catch(() => {});
      expect(client.lives.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x/thumbnail');
      expect(client.lives.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.lives.browser.lastRequest).to.deep.property('headers', {
        'User-Agent': `api.video SDK (nodejs; v:${version})`
      });
      expect(client.lives.browser.lastRequest.formData).to.be.an('object');
    });
  });

  describe('delete', () => {
    it('Does not throw', async () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      await client.lives.delete('lix1x1x1x1x1x1x1x1x1x');
    });

    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.lives.delete('lix1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.lives.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/live-streams/lix1x1x1x1x1x1x1x1x1x',
        method: 'DELETE',
        headers: {
          'User-Agent': `api.video SDK (nodejs; v:${version})`,
        },
        json: true,
      });
    });
  });

  describe('cast', () => {
    it('Should return live object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        liveStreamId: 'lix1x1x1x1x1x1x1x1x1x',
        streamKey: '6xx3x5x2-2x2x-468x-906x-xx3xx9xx79x7',
        name: 'Live test',
        record: true,
        broadcasting: false,
        assets: {
          iframe: '<iframe src="https://embed.api.video/live/lix1x1x1x1x1x1x1x1x1x" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen=""></iframe>',
          player: 'https://embed.api.video/live/lix1x1x1x1x1x1x1x1x1x',
          hls: 'https://live.api.video/live/lix1x1x1x1x1x1x1x1x1x.m3u8',
          thumbnail: 'https://cdn.api.video/live/lix1x1x1x1x1x1x1x1x1x/thumbnail.jpg',
        },
      };
      const live = client.lives.cast(data);
      expect(live).to.deep.equal(data);
    });
  });
});
