const expect = require('chai').expect;
const apiVideo = require('../lib');

describe('AnalyticsSessionEvent ressource', () => {
  describe('get without parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x');
      expect(client.analyticsSessionEvent.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });

  describe('GET with parameters', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const parameters = {
        currentPage: 1,
        pageSize: 25,
      };
      client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x', parameters);
      expect(client.analyticsSessionEvent.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true,
      });
    });
  });
});
