const { expect } = require('chai');
const apiVideo = require('../lib');
const AnalyticVideo = require('../lib/Model/Analytic/analyticVideo');
const AnalyticData = require('../lib/Model/Analytic/analyticData');
const analyticDataResponse = require('./api/analyticData');
const { ITEMS_TOTAL } = require('./api');

describe('AnalyticsVideo ressource', () => {
  describe('get without period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x');
    });

    it('Sends good request', () => {
      client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos/vix1x1x1x1x1x1x1x1x1x?currentPage=1&pageSize=100',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Return an analytic video object', async () => {
      const analyticVideo = await client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x');
      expect(analyticVideo).to.be.an('object');
      expect(analyticVideo).to.have.keys(Object.keys(new AnalyticVideo()));
      expect(analyticVideo.data).to.be.an('array');
      analyticVideo.data.forEach(
        analyticData => expect(analyticData).to.have.keys(Object.keys(new AnalyticData())),
      );
    });

    it('Return all analytic data', async () => {
      const analyticVideo = await client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x');
      expect(analyticVideo.data).to.be.an('array');
      expect(analyticVideo.data).to.be.of.length(ITEMS_TOTAL);
    });
  });

  describe('get with period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    it('Does not throw', async () => {
      await client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x', '2019-01');
    });

    it('Sends good request', () => {
      client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x', '2019-01').catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos/vix1x1x1x1x1x1x1x1x1x?currentPage=1&pageSize=100&period=2019-01',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Return an analytic video object', async () => {
      const period = '2019-01';
      const videoId = 'vix1x1x1x1x1x1x1x1x1x';
      const analyticVideo = await client.analyticsVideo.get(videoId, '2019-01');
      expect(analyticVideo).to.be.an('object');
      expect(analyticVideo).to.have.keys(Object.keys(new AnalyticVideo()));
      expect(analyticVideo).to.have.property('videoId', videoId);
      expect(analyticVideo).to.have.property('period', period);

      expect(analyticVideo.data).to.be.an('array');
      analyticVideo.data.forEach(
        analyticData => expect(analyticData).to.have.keys(Object.keys(new AnalyticData())),
      );
    });
  });

  describe('Search with parameters without period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {
      currentPage: 1,
      pageSize: 25,
    };

    it('Does not throw', async () => {
      await client.analyticsVideo
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsVideo.search(parameters).catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Search with parameters with period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {
      currentPage: 1,
      pageSize: 25,
      period: '2019-01',
    };

    it('Does not throw', async () => {
      await client.analyticsVideo
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsVideo.search(parameters).catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?currentPage=1&pageSize=25&period=2019-01',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Search without parameters without period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {};

    it('Does not throw', async () => {
      await client.analyticsVideo
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsVideo.search(parameters).catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Search without parameters with period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {
      period: '2019-01',
    };

    it('Does not throw', async () => {
      await client.analyticsVideo.search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsVideo.search(parameters).catch(() => {});
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?period=2019-01&pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('Casting analytic data', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      expect(
        client.analyticsVideo.cast.bind(client.analyticsVideo, analyticDataResponse),
      ).to.not.throw();
    });

    it('Cast date fields to Date objects', () => {
      const castedSession = client.analyticsVideo.cast(analyticDataResponse);
      expect(castedSession.session).to.have.property('loadedAt').that.is.an.instanceof(Date);
      expect(castedSession.session).to.have.property('endedAt').that.is.an.instanceof(Date);
    });
  });
});
