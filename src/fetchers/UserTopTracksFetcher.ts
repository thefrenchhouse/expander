import * as Immutable from 'immutable';
import { SpotifySongPresenter } from './presenters/SpotifySongPresenter'

// Given a SpotifyContext, fetch user saved songs (since last sync)
export class UserTopTracksFetcher {
    private redisClient: any;

    constructor(private spotifyApiContext: any) { }

    static fetch(spotifyApiContext: any) : Promise<Immutable.List<any>> {
      return (new UserTopTracksFetcher(spotifyApiContext)).fetch();
    }

    // Given a api instance:
    //  - fetch current user id
    //  - fetch last sync date from redis
    //  - fetch all saved tracks since last sync
    fetch(): Promise<Immutable.List<any>> {
      return new Promise((resolve, reject) =>  {
        this.fetchSpotifyUserSavedSongs(
          this.fetchLastSyncDate(this.spotifyApiContext.spotifyUserId)
        ).then(resolve, reject);
      });
    }

    ///////////////////
    // Private methods
    ///////////////////

    // Given a current SpotifyContext, fetch user last saved songs
    private fetchSpotifyUserSavedSongs(since = null): Promise<Immutable.List<any>> {
      const limit: number = 5;
      return new Promise((resolve, reject) => {
        this.spotifyApi.getMySavedTracks({
            limit : limit//,
            // offset: 0
          })
          .then(function(data) {
            if (since) {
              // TODO: filter songs by added_time
              resolve(
                SpotifySongPresenter.fromCollection(
                  data.body.items.map((item) => { return item.track; })
                )
              );
            } else {
              resolve(
                SpotifySongPresenter.fromCollection(
                  data.body.items.map((item) => { return item.track; })
                )
              );
            }
          }, reject).catch(reject);
      });
    }

    // Update sync date in Redis
    private updateLastSyncDate(userId: String, date: String): void {
      this.getRedisClient().set(`spotifyUserLastSyncDate-${userId}`, date);
    }

    // Fetch sync date in Redis
    private fetchLastSyncDate(userId: String): any {
      if (!userId) {
        return false;
      }

      let lastSyncDate: String = '';
      lastSyncDate = this.getRedisClient().get(`spotifyUserLastSyncDate-${userId}`)
      return !!lastSyncDate ? lastSyncDate : false;
    }

    // create Redis client
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
