import * as Immutable from 'immutable';
import { SpotifySongPresenter } from './presenters/SpotifySongPresenter'

export class ArtistTopTrack {

  static fromTracks(spotifyApi: any, userId: String, artists: Immutable.Set<String>): Promise<any> {
    let promises = artists.map( (artistId) => {
      let creator = new ArtistTopTrack(spotifyApi, userId, artistId);
      return creator.execute();
    });
    return Promise.all(promises.toArray());
  }

  constructor(private spotifyApi: any, private userId: String, private artistId: String) {}

  public execute() {
    console.log('execute', this.artistId, this.userId);
    return new Promise( (resolve, reject) => {
      this.generateSongsList().then((songsList) => {
        return this.createPlaylist(songsList).then(resolve, reject);
      }, reject);
    });
  }

  public generateSongsList(): Promise<any> {
    console.log('generateSongsList');
    return new Promise( (resolve, reject) => {
      this.spotifyApi.getArtistTopTracks(this.artistId, 'FR')
        .then((data) => {
          resolve(SpotifySongPresenter.fromCollection(data.body.tracks));
        }, reject).catch(reject);
    });
  }

  private createPlaylist(songsList: any) {
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