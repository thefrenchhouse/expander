import { SpotifySync } from './spotifySync'

var SpotifyWebApi = require('spotify-web-api-node'),
    config        = require('../../application-config.json');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : config.SpotifyClientId,
  clientSecret : config.SpotifyClientSecret,
  redirectUri : config.SpotifyRedirectUri
});

spotifyApi.setAccessToken(config.SpotifyAccessToken);


let spotifySync = new SpotifySync(spotifyApi);
spotifySync.fetch(true).then((songsList) => {
  console.dir(songsList);
}, (error) =>  { console.error(error) });