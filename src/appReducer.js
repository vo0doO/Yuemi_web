import _ from 'lodash';

const getInitialState = () => {
	return {
		searchResults: [],
		loading: false,
		timer: null,
		downloading: {
			video: {}, // id -> {id, progress, title, uploader, views, duration, requested}
			audio: {} // same as video
		},
		downloaded: {
			audio: {}, // same as downloading audio
			video: {} // same as downloading video
		},
		feed: [],
		searchText: '',
		videoViewerShowing: false,
		videoViewerContent: {}
	};
};

const copyState = (state) => {
	return JSON.parse(JSON.stringify(state)); // split reducers and use Object.assign instead of this
};

const reducer = (state = getInitialState(), action) => {
	let newState;
	switch (action.type) {

	case 'UPDATE_SEARCH_RESULTS':
		newState = copyState(state);
		newState.searchResults = action.videos;
		return newState;

	case 'UPDATE_SEARCH_TEXT':
		newState = copyState(state);
		newState.searchText = action.text;
		return newState;

	case 'SET_LOADING':
		newState = copyState(state);
		newState.loading = action.bool;
		return newState;

	case 'ADD_DOWNLOAD':
		newState = copyState(state);
		// Add content to downloaded
		newState.downloaded[action.mediaType][action._id] = action.bundle;
		// Add content to downloading
		newState.downloading[action.mediaType][action._id] = action.bundle;
		newState.downloading[action.mediaType][action._id].active = false;
		newState.downloading[action.mediaType][action._id].progress = 0;
		return newState;

	case 'REMOVE_DOWNLOAD': // ALSO ADDS TO DOWNLOADED. SHOULD BE TWO ACTIONS?
		newState = copyState(state);
		newState.downloaded[action.mediaType][action._id] = newState.downloading[action.mediaType][action._id];
		newState.downloading[action.mediaType] = _.omit(newState.downloading[action.mediaType], action._id);
		return newState;

	case 'SET_PROGRESS':
		newState = copyState(state);
		newState.downloading[action.mediaType][action._id].progress = action.progress;
		return newState;

	case 'SET_ACTIVE':
		newState = copyState(state);
		newState.downloading[action.mediaType][action._id].active = true;
		return newState;

	case 'SET_TIMER':
		newState = copyState(state);
		newState.timer = action.timer;
		return newState;

	case 'UPDATE_FEED':
		newState = copyState(state);
		newState.feed = action.feed;
		return newState;

	case 'SET_VIDEO_VIEWER':
		newState = copyState(state);
		newState.videoViewerShowing = action.bool;
		newState.videoViewerContent = action.video;
		return newState;

	default:
		return state;

	}
};

export default reducer;
