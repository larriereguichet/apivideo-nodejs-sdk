const Browser = require('./Browser/browser');
const Videos = require('./Api/videos');
const Lives = require('./Api/lives');
const Players = require('./Api/players');
const Captions = require('./Api/captions');
const Chapters = require('./Api/chapters');
const AnalyticsVideo = require('./Api/analyticsVideo');
const AnalyticsLive = require('./Api/analyticsLive');
const AnalyticsSessionEvent = require('./Api/analyticsSessionEvent');
const Tokens = require('./Api/tokens');
const { version } = require('../package.json');


const ClientSandbox = function ClientSandbox(config) {
  this.apiKey = config.apiKey;
  this.baseUri = 'https://sandbox.api.video';

  this.browser = new Browser(this.apiKey, this.baseUri, version);
  this.videos = new Videos(this.browser);
  this.lives = new Lives(this.browser);
  this.players = new Players(this.browser);
  this.captions = new Captions(this.browser);
  this.chapters = new Chapters(this.browser);
  this.analyticsVideo = new AnalyticsVideo(this.browser);
  this.analyticsLive = new AnalyticsLive(this.browser);
  this.analyticsSessionEvent = new AnalyticsSessionEvent(this.browser);
  this.tokens = new Tokens(this.browser);
};

module.exports = ClientSandbox;
