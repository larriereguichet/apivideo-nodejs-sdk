const apiVideo = require('../lib');

describe('apiVideo.Client', () => {
  it('should use the Browser class', () => {
    const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
    expect(client.browser).toBeInstanceOf(apiVideo.Browser);
  })
});