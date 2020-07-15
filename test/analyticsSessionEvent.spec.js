const { expect } = require('chai');
const apiVideo = require('../lib');
const { ITEMS_TOTAL } = require('./api');

describe('AnalyticsSessionEvent ressource', () => {
  describe('get without parameters', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x');
    });

    it('Sends good request', () => {
      client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.analyticsSessionEvent.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('get first page', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });
    const parameters = {
      currentPage: 1,
      pageSize: 25,
    };

    it('Does not throw', async () => {
      await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x', parameters);
    });

    it('Sends good request', () => {
      client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x', parameters).catch(() => {});
      expect(client.analyticsSessionEvent.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Retrieves only the first page', async () => {
      const analyticSessionEvent = await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x', parameters);
      expect(analyticSessionEvent.events).to.have.lengthOf(parameters.pageSize);
    });
  });

  describe('get without parameters', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsSessionEvent
        .get('psx1x1x1x1x1x1x1x1x1x');
    });

    it('Sends good request', () => {
      client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x').catch(() => {});
      expect(client.analyticsSessionEvent.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });

    it('Retrieves all pages', async () => {
      const analyticSessionEvent = await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x');
      expect(analyticSessionEvent.events).to.have.lengthOf(ITEMS_TOTAL);
    });
  });
});
