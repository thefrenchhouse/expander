import * as Immutable from 'immutable';
import { SpotifySync } from './spotifySync'
import { ArtistTopTrack } from './ArtistTopTrack'

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
  ArtistTopTrack.fromTracks(
    spotifyApi,
    spotifySync.userId,
    songsList.map((songItem: any, key: Number) => {
      return songItem.artistId as String;
    }).toSet()
  ).then((result) => {
    console.log('done !');
  }, (error) =>  { console.error(error) });
}, (error) =>  { console.error(error) });