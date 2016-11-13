import * as Immutable from 'immutable';
import { SpotifySongPresenter } from './presenters/SpotifySongPresenter'

export class SpotifySync {
    private spotifyApi: any;
    private redisClient: any;

    constructor(spotifyApi: any) {
      this.spotifyApi = spotifyApi;
    }

    // Given a api instance:
    //  - fetch current user id
    //  - fetch last sync date from redis
    //  - fetch all saved tracks since last sync
    // 
    // (Note: if `reset` is false, fetch all user saved tracks
    fetch(reset = false): Promise<Immutable.List<any>> {
      if (!reset) {
        return new Promise((resolve, reject) =>  {
          this.fetchSpotifyUserId().then((userId) => {
            this.fetchSpotifyUserSavedSongs(
              this.fetchLastSyncDate(userId)
            ).then(resolve, reject);
          }, reject)
        });
      } else {
        return this.fetchSpotifyUserSavedSongs();
      }
    }

    ///////////////////
    // Private methods
    ///////////////////

    private fetchSpotifyUserId(): Promise<String> {
      return new Promise((resolve, reject) => {
        this.spotifyApi.getMe().then( (data) => {
          resolve(data.body.id);
        }, reject);
      });
    }

    private fetchSpotifyUserSavedSongs(since = null): Promise<Immutable.List<any>> {
      const limit: number = 50;
      return new Promise((resolve, reject) => {
        this.spotifyApi.getMySavedTracks({
            limit : limit//,
            // offset: 0
          })
          .then(function(data) {
            if (since) {
              // TODO: filter songs by added_time
              resolve(SpotifySongPresenter.fromCollection(data.body.items));
            } else {
              resolve(SpotifySongPresenter.fromCollection(data.body.items));
            }
          }, reject).catch(reject);
      });
    }

    private updateLastSyncDate(userId: String, date: String): void {
      this.getRedisClient().set(`spotifyUserLastSyncDate-${userId}`, date);
    }

    private fetchLastSyncDate(userId: String): any {
      if (!userId) {
        return false;
      }

      let lastSyncDate: String = '';
      lastSyncDate = this.getRedisClient().get(`spotifyUserLastSyncDate-${userId}`)
      return !!lastSyncDate ? lastSyncDate : false;
    }

    private getRedisClient(): any {
      if (this.redisClient) {
        return this.redisClient;
      } else {
        let redis = require("redis"),
            client = redis.createClient();

        return client;
      }
    }
}
