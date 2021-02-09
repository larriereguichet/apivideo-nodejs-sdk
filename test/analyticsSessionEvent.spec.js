const { expect } = require('chai');
const apiVideo = require('../lib');
const { ITEMS_TOTAL } = require('./api');

describe('AnalyticsSessionEvent ressource', () => {
  describe('get without parameters', () => {
    const client = new apiVideo.Client({ apiKey: 'test' });

    it('Does not throw', async () => {
      await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x');
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

    it('Retrieves all pages', async () => {
      const analyticSessionEvent = await client.analyticsSessionEvent.get('psx1x1x1x1x1x1x1x1x1x');
      expect(analyticSessionEvent.events).to.have.lengthOf(ITEMS_TOTAL);
    });
  });
});
