import * as Immutable from 'immutable';
import { SpotifySongPresenter } from './presenters/SpotifySongPresenter'
import { UserTopTracksFetcher } from './fetchers/UserTopTracksFetcher'

// Given a SpotifyContext, fetch user saved songs
//  and generate a playlist for each artist
export class ArtistsTopTracks {

  static execute(spotifyApiContext: any): Promise<any> {
    return (new ArtistsTopTracks(spotifyApiContext)).execute();
  }

  constructor(private spotifyApiContext: any) {}

  // (see top class documentation)
  public execute() {
    return new Promise( (resolve, reject) => {
      this.fetchArtists().then((artistsList) => {
        let promises = artistsList.map( (artistId) => {
          return this.createPlaylistForArtist(artistId);
        });
        resolve(Promise.all(promises.toArray()));
      }, reject);
    });
  }

  ///////////////////
  // Private methods
  ///////////////////

  // Given current SpotifyContext, fetch user last
  //  saved tracks and return artists Set
  private fetchArtists(): Promise<any> {
    return new Promise( (resolve, reject) => {
      UserTopTracksFetcher.fetch(this.spotifyApiContext).then( (songsList) {
        resolve(
          songsList.map((songItem: any, key: Number) => {
            return songItem.artistId as String;
          }).toSet()
        );
      }, reject);
    });
  }

  // Given an artist, create a top tracks playlist
  private createPlaylistForArtist(artistId): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.generateSongsList().then((songsList) => {
        return this.createPlaylist(songsList).then(resolve, reject);
      }, reject);
    });
  }

  // Given an Artist, fetch top tracks
  private generateSongsList(artistId): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.spotifyApi.getArtistTopTracks(artistId, 'FR')
        .then((data) => {
          resolve(SpotifySongPresenter.fromCollection(data.body.tracks));
        }, reject).catch(reject);
    });
  }

  // Create a playlist with given `songsList`
  private createPlaylist(songsList: any): Promise<any> {
    console.log('createPlaylist', this.userId, songsList);
    let ctx = this;
    return new Promise( (resolve, reject) => {
      ctx.spotifyApi.createPlaylist(ctx.userId, `Expander - ${Math.random()}`, { 'public' : false })
        .then(function(data) {
          let playlistId = data.body.id;
          console.log('addTracksToPlaylist',ctx.userId, playlistId, songsList.map((songItem) => songItem.id));

          ctx.spotifyApi.addTracksToPlaylist(ctx.userId, playlistId, songsList.map((songItem) => songItem.id ).toArray())
            .then(resolve, reject);
        }, reject).catch(reject);

    });
  }

}