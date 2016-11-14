import * as Immutable from 'immutable';
import { SpotifySync } from './spotifySync'
import { PlaylistCreator } from './PlaylistCreator'

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
spotifySync.fetch().then((songsList) => {
  console.log('spotifySync.userId', spotifySync.userId);
  PlaylistCreator.forEachArtist(
    spotifyApi,
    spotifySync.userId,
    songsList.map((songItem: any, key: Number) => {
      return songItem.artistId as String;
    }).toSet()
  ).then((result) => {
    console.log('done !');
  }, (error) =>  { console.error(error) });
}, (error) =>  { console.error(error) });


// TODO
//  - extract last saved songs
//  - extract artists list
//  - for each artist, return 5-10 songs, sort by popularity
//  - group songs by "type"
//  - create "n" playlists by "types"