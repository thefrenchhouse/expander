# Expander [![Code Climate](https://codeclimate.com/github/thefrenchhouse/expander/badges/gpa.svg)](https://codeclimate.com/github/thefrenchhouse/expander)
Music explorer, create playlists based on user saved songs (Spotify)

Expander is an application that helps to discover songs from artists.
When a song is "saved", Expander will create you some playlists based on song's artist and Spotify recommendation.

-------------


## Roadmap

### Beta

##### Algorithm
* Fetch all song in “Saved” Playlist since last fetch
  - https://developer.spotify.com/web-api/console/get-current-user-saved-tracks/
* Categorize songs (manual?)
  - https://developer.spotify.com/web-api/get-audio-features/
  - https://developer.spotify.com/web-api/get-audio-analysis/
* List all Artist / Album / Year, fetch 3 songs by artist
* Create a mix playlist by week by music genre


## Technical

- using https://github.com/thelinmichael/spotify-web-api-node
