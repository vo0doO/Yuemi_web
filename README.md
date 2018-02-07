# Yuemi_web
Yuemi's React web application.

## Usage
Popular music streaming apps today don't have a lot of foreign music. Youtube remains the largest database of music in the world and has the best recommendation algorithm. As such, many people listen to their music on youtube, and resort to using slow, limited, ad-filled websites to download the music they love. Yuemi allows you to search for music you like or paste a youtube link (or even a playlist link), and download at very high speeds.

On load, the user is presented with a feed of music or videos recently downloaded by other users, and a search bar. In the search bar, the user can type a song or video name, or paste a youtube link. Upon finding a video, the user can press the red-pink button to download the audio from the video as an mp3, or can press the turquoise button to download the highest quality mp4.

Since I simply do not use commercial music streaming apps like Spotify or Pandora, and have an iPhone and a MacBook, I recommend downloading music from Yuemi or other sources and simplying adding the music to iTunes, editing the song info quickly with CMD+i, deleting the original file as iTunes makes a copy upon import, and then syncing to an iPhone, generally over WiFi.

As a lot of youtube videos have extremely inconsistent audio, the iTunes Sound Check feature, found in `Preferences > Playback > Sound Check` is very helpful. Sound Check is also available on iPhone, found at `Settings App > Music > Sound Check`

## Dependencies
- nodejs
- youtube-dl
- mongodb
- ffmpeg
- avconv (libav)
- python

## Development
After installing the dependencies:
~~~
brew install python ffmpeg mondodb youtube-dl node
~~~
you can begin development by running:
~~~
git clone https://github.com/otmichael/Yuemi_web.git
cd Yuemi_web
yarn
mongod
npm start
~~~
To build for production,
~~~
npm run build
~~~
To serve for production,
~~~
npm run prod
~~~
To test,
~~~
npm run test
~~~

