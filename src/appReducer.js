import _ from 'lodash';

const getInitialState = () => {
	return {
		searchResults: [],
		loading: false,
		timer: null,
		downloading: {}, // id -> {id, progress, title, uploader, views, duration, requested}
		downloaded: {}, // same as downloading
		feed: [],
	};
};

const copyState = (state) => {
	return JSON.parse(JSON.stringify(state)); // split reducers and use Object.assign instead of this.
	// Is not intensive because this app is fairly small
	// No one's going to add 10,000 downloads.
};

const reducer = (state = getInitialState(), action) => {
	let newState;
	switch (action.type) {

	case 'UPDATE_SEARCH_RESULTS':
		newState = copyState(state);
		newState.searchResults = action.videos;
		return newState;

	case 'SET_LOADING':
		newState = copyState(state);
		newState.loading = action.bool;
		return newState;

	case 'ADD_DOWNLOAD':
		newState = copyState(state);
		newState.downloading[action._id] = action.bundle;
		newState.downloading[action._id].active = false;
		newState.downloading[action._id].progress = 0;
		return newState;

	case 'REMOVE_DOWNLOAD': // ALSO ADDS TO DOWNLOADED. SHOULD BE TWO ACTIONS?
		newState = copyState(state);
		newState.downloaded[action._id] = newState.downloading[action._id];
		newState.downloading = _.omit(newState.downloading, action._id);
		return newState;

	case 'SET_PROGRESS':
		newState = copyState(state);
		newState.downloading[action._id].progress = action.progress;
		return newState;

	case 'SET_ACTIVE':
		newState = copyState(state);
		newState.downloading[action._id].active = true;
		return newState;

	case 'SET_TIMER':
		newState = copyState(state);
		newState.timer = action.timer;
		return newState;

	case 'UPDATE_FEED':
		newState = copyState(state);
		newState.feed = action.feed;
		return newState;

	default:
		return state;

	}
};

export default reducer;
