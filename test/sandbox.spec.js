const { expect } = require('chai');
const got = require('got');
const apiVideo = require('../lib/index');
const Caption = require('../lib/Model/caption');

const timeout = (ms = 100) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

(async () => {
  try {
    if (!process.env.API_KEY) {
      console.error('You must provide `API_KEY` environnment variable to test the sandbox.');
      console.log('API_KEY=xxx yarn test:sandbox');

      process.exit(1);
    }

    // Create client for Sandbox and authenticate
    const client = new apiVideo.ClientSandbox({ apiKey: process.env.API_KEY });

    // Create and upload a video ressource
    const { videoId, title } = await client.videos.upload('test/data/small.webm', { title: 'Course #4 - Part B' });

    // Update video properties
    const newDescription = 'Course #4 - Part C';
    await client.videos.update(videoId, { description: newDescription }).then((video) => {
      expect(video.description).to.equals(newDescription);
    });

    // Search videos with paginated results
    await client.videos.search({ currentPage: 1, pageSize: 50 }).then((videos) => {
      videos.forEach(video => console.log(video.videoId));
    });

    // Upload a video thumbnail
    await client.videos.uploadThumbnail('test/data/test.jpg', videoId).then((video) => {
      expect(video.title).to.equals(title);
    });

    // Update video thumbnail by picking image with video timecode
    await client.videos.updateThumbnailWithTimecode(videoId, '00:15:22.05').then((video) => {
      expect(video.title).to.equals(title);
    });

    // Upload video caption
    await client.captions.upload('test/data/en.vtt', { videoId, language: 'en' }).then((caption) => {
      expect(caption).to.have.keys(new Caption());
    });

    await timeout(1000);

    // Get video caption by language
    await client.captions.get(videoId, 'en').then((caption) => {
      console.log(caption.src);
    });

    // Update the default caption language
    await client.captions.updateDefault(videoId, 'en', true).then((caption) => {
      console.log(caption);
    });

    // Delete caption by language
    await client.captions.delete(videoId, 'en').then((statusCode) => {
      expect(statusCode).to.equals(204);
    }).catch((error) => {
      console.error(error);
    });

    // Upload video chapter
    await client.chapters.upload('test/data/en.vtt', { videoId, language: 'en' }).then((chapter) => {
      console.log(chapter.src);
    });

    await timeout(1000);

    // Get video chapter by language
    await client.chapters.get(videoId, 'en').then((chapter) => {
      console.log(chapter.src);
    });

    // Delete chapter by language
    await client.chapters.delete(videoId, 'en').then((statusCode) => {
      console.log(statusCode);
    }).catch((error) => {
      console.error(error);
    });

    // Get video Analytics Data for the current year
    await client.analyticsVideo.get(videoId, new Date().getFullYear()).then((analyticVideo) => {
      expect(analyticVideo.data).to.be.an('array');
    });

    // Delete video ressource
    await client.videos.delete(videoId).then((statusCode) => {
      expect(statusCode).to.equals(204);
    }).catch((error) => {
      console.error(error);
    });

    // Create players with default values
    const { playerId } = await client.players.create();

    // Get a player
    await client.players.get(playerId).then(player => console.log(player.playerId));

    // Search a player with paginate results
    await client.players.search({ currentPage: 1, pageSize: 50 }).then((players) => {
      players.forEach(player => player.playerId);
    });

    const properties = {
      shapeMargin: 10,
      shapeRadius: 3,
      shapeAspect: 'flat',
      shapeBackgroundTop: 'rgba(50, 50, 50, .7)',
      shapeBackgroundBottom: 'rgba(50, 50, 50, .8)',
      text: 'rgba(255, 255, 255, .95)',
      link: 'rgba(255, 0, 0, .95)',
      linkHover: 'rgba(255, 255, 255, .75)',
      linkActive: 'rgba(255, 0, 0, .75)',
      trackPlayed: 'rgba(255, 255, 255, .95)',
      trackUnplayed: 'rgba(255, 255, 255, .1)',
      trackBackground: 'rgba(0, 0, 0, 0)',
      backgroundTop: 'rgba(72, 4, 45, 1)',
      backgroundBottom: 'rgba(94, 95, 89, 1)',
      backgroundText: 'rgba(255, 255, 255, .95)',
      enableApi: true,
      enableControls: true,
      forceAutoplay: false,
      hideTitle: true,
      forceLoop: true,
    };

    await client.players.update(playerId, properties).then(player => player.forceLoop);

    await client.players.uploadLogo('test/data/test.jpg', playerId, 'https://api.video').then((player) => {
      console.log(player.logo);
    });

    await client.players.delete(playerId).then((statusCode) => {
      console.log(statusCode);
    }).catch((error) => {
      console.error(error);
    });

    // Create a live
    const { liveStreamId } = await client.lives.create('This is a live');

    // Get live Analytics Data for the current year
    await client.analyticsLive.get(liveStreamId, new Date().getFullYear()).then((analyticLive) => {
      expect(analyticLive.data).to.be.an('array');
    });

    // Delete live ressource
    await client.lives.delete(liveStreamId).then((statusCode) => {
      console.log(statusCode);
    }).catch((error) => {
      console.error(error);
    });

    // Generate a token for delegated upload
    await client.tokens.generate().then((token) => {
      console.log(token);
    });
  } catch (e) {
    console.error(e);
  }
})();
