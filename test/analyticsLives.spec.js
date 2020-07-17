const { expect } = require('chai');
const apiVideo = require('../lib');
const AnalyticLive = require('../lib/Model/Analytic/analyticLive.js');
const AnalyticData = require('../lib/Model/Analytic/analyticData.js');
const { ITEMS_TOTAL } = require('./api');
const analyticDataResponse = require('./api/analyticData');

describe('analyticsLive ressource', () => {
  describe('get without period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsLive.get('lix1x1x1x1x1x1x1x1x1x');
    });

    it('Sends good request', () => {
      client.analyticsLive.get('lix1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams/lix1x1x1x1x1x1x1x1x1x?currentPage=1&pageSize=100',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Return an analytic video object', async () => {
      const liveStreamId = 'lix1x1x1x1x1x1x1x1x1x';
      const analyticVideo = await client.analyticsLive.get(liveStreamId);
      expect(analyticVideo).to.be.an('object');
      expect(analyticVideo).to.have.keys(Object.keys(new AnalyticLive()));
      expect(analyticVideo).to.have.property('liveStreamId', liveStreamId);
      expect(analyticVideo.data).to.be.an('array');
      analyticVideo.data.forEach(
        analyticData => expect(analyticData).to.have.keys(Object.keys(new AnalyticData())),
      );
    });

    it('Return all analytic data', async () => {
      const analyticVideo = await client.analyticsLive.get('lix1x1x1x1x1x1x1x1x1x');
      expect(analyticVideo.data).to.be.an('array');
      expect(analyticVideo.data).to.be.of.length(ITEMS_TOTAL);
    });
  });

  describe('get with period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsLive.get('lix1x1x1x1x1x1x1x1x1x', '2019-01');
    });

    it('Sends good request', () => {
      client.analyticsLive.get('lix1x1x1x1x1x1x1x1x1x', '2019-01').catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams/lix1x1x1x1x1x1x1x1x1x?currentPage=1&pageSize=100&period=2019-01',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Return an analytic video object', async () => {
      const period = '2019-01';
      const liveStreamId = 'lix1x1x1x1x1x1x1x1x1x';
      const analyticLive = await client.analyticsLive.get(liveStreamId, '2019-01');
      expect(analyticLive).to.be.an('object');
      expect(analyticLive).to.have.keys(Object.keys(new AnalyticLive()));
      expect(analyticLive).to.have.property('liveStreamId', liveStreamId);
      expect(analyticLive).to.have.property('period', period);

      expect(analyticLive.data).to.be.an('array');
      analyticLive.data.forEach(
        analyticData => expect(analyticData).to.have.keys(Object.keys(new AnalyticData())),
      );
    });
  });

  describe('Search first page parameters without period', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {
      currentPage: 1,
      pageSize: 25,
    };

    it('Does not throw', async () => {
      await client.analyticsLive.search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsLive.search(parameters).catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams?currentPage=1&pageSize=25',
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
      await client.analyticsLive
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsLive.search(parameters).catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams?currentPage=1&pageSize=25&period=2019-01',
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
      await client.analyticsLive
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsLive.search(parameters).catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams?pageSize=100&currentPage=1',
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
      await client.analyticsLive
        .search(parameters);
    });

    it('Sends good request', () => {
      client.analyticsLive.search(parameters).catch(() => {});
      expect(client.analyticsLive.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/live-streams?period=2019-01&pageSize=100&currentPage=1',
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
        client.analyticsLive.cast.bind(client.analyticsLive, analyticDataResponse),
      ).to.not.throw();
    });

    it('Cast date fields to Date objects', () => {
      const analyticData = client.analyticsLive.cast(analyticDataResponse);
      expect(analyticData.session).to.have.property('loadedAt').that.is.an.instanceof(Date);
      expect(analyticData.session).to.have.property('endedAt').that.is.an.instanceof(Date);
    });
  });
});
