import { SpotifySync } from './spotifySync'

// old import for modules without tsd
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
  console.log(JSON.stringify(songsList))
  // PlaylistCreator.forEachArtist(
  //  Utils.groupByArtist(songsList)
  // )
}, (error) =>  { console.error(error) });


// TODO
//  - extract last saved songs
//  - extract artists list
//  - for each artist, return 5-10 songs, sort by popularity
//  - group songs by "type"
//  - create "n" playlists by "types"