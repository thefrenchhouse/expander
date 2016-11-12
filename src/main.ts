var SpotifyWebApi = require('spotify-web-api-node'),
    config        = require('../../application-config.json');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : config.SpotifyClientId,
  clientSecret : config.SpotifyClientSecret,
  redirectUri : config.SpotifyRedirectUri
});

spotifyApi.setAccessToken(config.SpotifyAccessToken);

spotifyApi.getMySavedTracks({
  limit : 2,
  offset: 1
})
.then(function(data) {
  console.log('Done!', data);
}, function(err) {
  console.log('Something went wrong!', err);
});