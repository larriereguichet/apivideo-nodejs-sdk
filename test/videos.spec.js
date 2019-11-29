const path = require('path');
const { expect } = require('chai');
const apiVideo = require('../lib');

// eslint-disable-next-line no-undef
describe('Videos ressource', () => {
  // eslint-disable-next-line no-undef
  describe('create', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const title = 'Video test';
      const properties = {
        description: 'Video test',
      };
      client.videos.create(title, properties).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos',
        method: 'POST',
        headers: {},
        body: { description: 'Video test', title: 'Video test' },
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('update', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        description: 'Video test 2',
        tag: ['test1', 'test2'],
      };
      client.videos.update('vix1x1x1x1x1x1x1x1x1x', properties).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: { description: 'Video test 2', tag: ['test1', 'test2'] },
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('get', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.videos.get('vix1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('getStatus', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.videos.getStatus('vix1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/status',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('Search with parameters', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      client.videos.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('Search without parameters', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {};
      client.videos.search(parameters).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('Download', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = 'https://www.example.com/video.mp4';
      const title = 'Video test';
      const properties = {
        description: 'Video test',
      };
      client.videos.download(source, title, properties).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos',
        method: 'POST',
        headers: {},
        body: { description: properties.description, title, source },
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('Upload', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/small.webm');
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      client.videos.upload(source, {}, videoId).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/source');
      expect(client.videos.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.videos.browser.lastRequest).to.deep.property('headers', {});
      expect(client.videos.browser.lastRequest.formData).to.be.an('object');
    });
  });

  // eslint-disable-next-line no-undef
  describe('Upload thumbnail', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const source = path.join(__dirname, 'data/test.png');
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      client.videos.uploadThumbnail(source, videoId).catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.property('url', 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail');
      expect(client.videos.browser.lastRequest).to.deep.property('method', 'POST');
      expect(client.videos.browser.lastRequest).to.deep.property('headers', {});
      expect(client.videos.browser.lastRequest.formData).to.be.an('object');
    });
  });

  // eslint-disable-next-line no-undef
  describe('makePublic', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        public: true,
      };
      client.videos.makePublic('vix1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('makePrivate', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        public: false,
      };
      client.videos.makePrivate('vix1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('updateThumbnailWithTimecode', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const properties = {
        timecode: '00:10:05.02',
      };
      client.videos.updateThumbnailWithTimecode('vix1x1x1x1x1x1x1x1x1x', '00:10:05.02').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail',
        method: 'PATCH',
        headers: {},
        body: properties,
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('delete', () => {
    // eslint-disable-next-line no-undef
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.videos.delete('vix1x1x1x1x1x1x1x1x1x').catch((error) => {
        console.log(error);
      });
      expect(client.videos.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/videos/vix1x1x1x1x1x1x1x1x1x',
        method: 'DELETE',
        headers: {},
        json: true,
      });
    });
  });

  // eslint-disable-next-line no-undef
  describe('cast', () => {
    // eslint-disable-next-line no-undef
    it('Should return video object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        videoId: 'vix1x1x1x1x1x1x1x1x1x',
        title: 'Video test',
        description: 'Video test',
        public: true,
        panoramic: false,
        mp4Support: false,
        tags: [],
        metadata: [],
        source: {
          type: 'upload',
          uri: '/videos/vix1x1x1x1x1x1x1x1x1x/source',
        },
        publishedAt: '2019-01-01T00:00:00+02:00',
        assets: {
          iframe: '<iframe src="https://embed.api.video/vod/vix1x1x1x1x1x1x1x1x1x" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen=""></iframe>',
          player: 'https://embed.api.video/vod/vix1x1x1x1x1x1x1x1x1x',
          hls: 'https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/hls/manifest.m3u8',
          thumbnail: 'https://cdn.api.video/vod/vix1x1x1x1x1x1x1x1x1x/thumbnail.jpg',
        },
      };
      const video = client.videos.cast(data);
      expect(video).to.deep.equal(data);
    });
  });

  // eslint-disable-next-line no-undef
  describe('castStatus', () => {
    // eslint-disable-next-line no-undef
    it('Should return videoStatus object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = {
        ingest: {
          status: 'uploaded',
          filesize: 273579401,
          receivedBytes: [
            {
              to: 134217727,
              from: 0,
              total: 273579401,
            },
            {
              to: 268435455,
              from: 134217728,
              total: 273579401,
            },
            {
              to: 273579400,
              from: 268435456,
              total: 273579401,
            },
          ],
        },
        encoding: {
          playable: true,
          qualities: [
            {
              quality: '360p',
              status: 'encoded',
            },
            {
              quality: '480p',
              status: 'encoded',
            },
            {
              quality: '720p',
              status: 'encoded',
            },
            {
              quality: '1080p',
              status: 'encoding',
            },
            {
              quality: '2160p',
              status: 'waiting',
            },
          ],
          metadata: {
            width: 424,
            height: 240,
            bitrate: 411.218,
            duration: 4176,
            framerate: 24,
            samplerate: 48000,
            videoCodec: 'h264',
            audioCodec: 'aac',
            aspectRatio: '16/9',
          },
        },
      };
      const videoStatus = client.videos.castStatus(data);
      expect(videoStatus).to.deep.equal(data);
    });
  });
});
