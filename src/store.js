import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './appReducer.js';
import { createLogger } from 'redux-logger';
import { loadState, saveState } from './lib/localStorage';

const logger = createLogger();
const useLogger = false;

const persistedState = loadState();

let store;
if (useLogger == true) {
	store = createStore(
		reducer,
		persistedState,
		applyMiddleware(thunk, logger)
	);
} else {
	store = createStore(reducer, persistedState);
}

store.subscribe(() => {
	saveState(store.getState());
});

// A few issues: Because of the newState function in the appReducer, if I just put saveState({downloaded: store.getState().downloaded}), It'll get an error, because when loadState loads the state, it only loads downloaded, and not anything else, and since the reducer is already passed the persistedState, it doesn't look to getInitialState to populate every object key. Therefore the newState method needs to be remade before proceeding. Additionally, if you download a song and refresh at an arbitrary percentage, it will be stuck at that percentage because the socket disconnected. Since socket.io doesn't provide any hooks that can be stored into localStorage, another method will have to be found. Also, if you refresh halfway, and re download the song, it will download half the song, because the partial mp3 exists serverside and the server only does an fs.exists check before requesting the file. Since this will cause it to pass the fs.exists check, the mp3 will be sent. So we also need to store currently downloading songs into a database instead, and take them out right when they're done. Then, instead of an fs.exists check, there will be an isDownloading check and an fs.exists check and a hasBeenDownloaded check. If the song is not in isDownloading, but is in hasBeenDownloaded, we know it has been successfully downloaded per logic. If it is in isDownloading but not in hasBeenDownloaded, we know a download is in progress. If it is in neither schema, but the file exists, there has been an error. Or perhaps if you interrupt the connection but youtube-dl keeps going, the download will be stuck in downloading forever? persistance works for now, just don't refresh while you're downloading music as you usually wouldn't.

export default store;
