const { expect } = require('chai');
const apiVideo = require('../lib');

describe('Tokens ressource', () => {
  describe('generate', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      client.tokens.generate().catch((error) => {
        console.log(error);
      });
      expect(client.tokens.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/tokens',
        method: 'POST',
        headers: {},
        body: {},
        json: true,
      });
    });
  });

  describe('cast', () => {
    it('Should return caption object', () => {
      const client = new apiVideo.Client({ apiKey: 'test' });
      const data = { token: 'tox1x1x1x1x1x1x1x1x1x' };
      const token = client.tokens.cast(data);
      expect(token).to.deep.equal(data.token);
    });
  });
});
