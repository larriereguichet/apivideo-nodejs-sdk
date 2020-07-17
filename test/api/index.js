const nock = require('nock');
const url = require('url');
const createCollection = require('./createCollection');
const video = require('./video');
const liveStream = require('./liveStream');
const analyticData = require('./analyticData');
const sessionEvent = require('./sessionEvent');
const chapter = require('./chapter');
const caption = require('./caption');
const player = require('./player');

const BASE = 'https://ws.api.video';
const ITEMS_TOTAL = 293;

const fromEntries = (entries) => {
  const params = {};
  for (const [key, value] of entries) {
    params[key] = Number(value);
  }

  return params;
};

const getRequestParameters = (req) => {
  const { searchParams } = new url.URL(req.path, BASE);
  return fromEntries(searchParams.entries());
};

const createCollectionReply = (item, itemsTotal = ITEMS_TOTAL) => function () {
  return createCollection(item)(Object.assign(
    getRequestParameters(this.req),
    { itemsTotal },
  ));
};

exports.mochaHooks = {
  beforeEach(done) {
    nock(BASE)
      .persist()
      // auth
      .post('/auth/api-key', {
        apiKey: 'test',
      })
      .reply(200, {
        token_type: '',
        access_token: '',
        refresh_token: '',
      })
      // tokens
      .post('/tokens')
      .reply(201)

      // videos
      .get('/videos')
      .query(true)
      .reply(200, createCollectionReply(video))
      .post('/videos')
      .query(true)
      .reply(201)
      .get('/videos/vix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200, video)
      .patch('/videos/vix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200)
      .delete('/videos/vix1x1x1x1x1x1x1x1x1x')
      .reply(200)

      // video thumbnail
      .post('/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail')
      .reply(201)
      .patch('/videos/vix1x1x1x1x1x1x1x1x1x/thumbnail')
      .reply(200)

      // video status
      .get('/videos/vix1x1x1x1x1x1x1x1x1x/status')
      .reply(201)

      // video source
      .post('/videos/vix1x1x1x1x1x1x1x1x1x/source')
      .reply(201)

      // videos chapters
      .get('/videos/vix1x1x1x1x1x1x1x1x1x/chapters')
      .query(true)
      .reply(200, createCollectionReply(chapter))
      .get('/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en')
      .reply(200, createCollectionReply(chapter))
      .post('/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en')
      .reply(201, chapter)
      .delete('/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en')
      .reply(200)
      .patch('/videos/vix1x1x1x1x1x1x1x1x1x/chapters/en')
      .reply(200)

      // videos captions
      .get('/videos/vix1x1x1x1x1x1x1x1x1x/captions')
      .reply(200, createCollectionReply(caption))
      .get('/videos/vix1x1x1x1x1x1x1x1x1x/captions/en')
      .reply(200, createCollectionReply(caption))
      .post('/videos/vix1x1x1x1x1x1x1x1x1x/captions/en')
      .reply(201, caption)
      .delete('/videos/vix1x1x1x1x1x1x1x1x1x/captions/en')
      .reply(200)
      .patch('/videos/vix1x1x1x1x1x1x1x1x1x/captions/en')
      .reply(200)

      // videos analytics
      .get('/analytics/videos/vix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200, createCollectionReply(analyticData))
      .get('/analytics/videos')
      .query(true)
      .reply(200, createCollectionReply(analyticData))

      // sessions
      .get('/analytics/sessions/psx1x1x1x1x1x1x1x1x1x/events')
      .query(true)
      .reply(200, createCollectionReply(sessionEvent))

      // live-streams
      .get('/live-streams')
      .query(true)
      .reply(200, createCollectionReply(liveStream))

      .post('/live-streams')
      .query(true)
      .reply(201)
      .get('/live-streams/lix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200, liveStream)
      .patch('/live-streams/lix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200)
      .delete('/live-streams/lix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200)
      .post('/live-streams/lix1x1x1x1x1x1x1x1x1x/thumbnail')
      .query(true)
      .reply(201)
      .patch('/live-streams/lix1x1x1x1x1x1x1x1x1x/thumbnail')
      .query(true)
      .reply(200)

      // live-streams analytics
      .get('/analytics/live-streams/lix1x1x1x1x1x1x1x1x1x')
      .query(true)
      .reply(200, createCollectionReply(analyticData))
      .get('/analytics/live-streams')
      .query(true)
      .reply(200, createCollectionReply(analyticData))

      // players
      .get('/players')
      .query(true)
      .reply(200, createCollectionReply(player))
      .post('/players')
      .reply(200, player)

      // player
      .get('/players/plx1x1x1x1x1x1x1x1x1x')
      .reply(200, player)
      .patch('/players/plx1x1x1x1x1x1x1x1x1x')
      .reply(200)
      .delete('/players/plx1x1x1x1x1x1x1x1x1x')
      .reply(200)

      // player logo
      .post('/players/plx1x1x1x1x1x1x1x1x1x/logo')
      .reply(201)
      .delete('/players/plx1x1x1x1x1x1x1x1x1x/logo')
      .reply(200);
    done();
  },
};

exports.ITEMS_TOTAL = ITEMS_TOTAL;
