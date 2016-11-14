import * as Immutable from 'immutable';
import { ArtistsTopTrack } from './ArtistsTopTrack'
import { Bootstraper } from './spotify/Bootstraper'

// Fetch user last saved songs and 
//  create one playlist by Artist (top tracks)
Bootstraper.boot().then( (spotifyApiContext) => {
  ArtistsTopTrack.execute(spotifyApiContext).
    then( (status) => {
      console.log('status : ', status);
    }, (error) => {
      console.error('error : ', error);
    })
});