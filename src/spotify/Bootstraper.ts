// old import for modules without tsd
var SpotifyWebApi = require('spotify-web-api-node'),
    config        = require('../../application-config.json');

// This class is responsible of handling
//  current user api informations
//    - user_id and spotify client
class SpotifyApiContext {
  constructor(public spotifyApi: any, public spotifyUserId: String) { }
}

// The Boostraper create a Spotify client
//  and fetch the current user id
export class Bootstraper {
  public userId: String;

  constructor(private spotifyApi = null) {
    this.spotifyApi = new SpotifyWebApi({
      clientId : config.SpotifyClientId,
      clientSecret : config.SpotifyClientSecret,
      redirectUri : config.SpotifyRedirectUri
    });
    spotifyApi.setAccessToken(config.SpotifyAccessToken);
  }

  static boot(): Promise<any> {
    return new Bootstraper().boot();
  }

  public boot(): Promise<any> {
    return Promise.new( (resolve, reject) => {
      this.fetchSpotifyUserId().
        then( () => {
          resolve(new SpotifyApiContext(this.spotifyApi, this.userId));
        }, reject)
    });
  }

  private fetchSpotifyUserId(): Promise<String> {
    return new Promise((resolve, reject) => {
      this.spotifyApi.getMe().then( (data) => {
        this.userId = data.body.id;
        resolve();
      }, reject);
    });
  }

}