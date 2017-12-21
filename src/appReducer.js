import _ from "lodash";

const getInitialState = () => {
	return {
		searchResults: [],
		loading: false,
		timer: null,
		downloading: {}, // id -> progress
	}
}

const copyState = (state) => {
	return (
		Object.assign({}, state, {
			downloading: Object.assign({}, state.downloading)
		})
	)
}

const reducer = (state=getInitialState(), action) => {
	let newState;
	switch(action.type){

		case "UPDATE_SEARCH_RESULTS":
			newState = copyState(state);
			newState.searchResults = action.videos;
			return newState;

		case "SET_LOADING":
			newState = copyState(state);
			newState.loading = action.bool;
			return newState;

		case "ADD_DOWNLOAD":
			newState = copyState(state);
			newState.downloading[action.id] = 0;
			return newState;

		case "REMOVE_DOWNLOAD":
			newState = copyState(state);
			newState.downloading = _.omit(newState.downloading, action.id);
			return newState;

		case "SET_PROGRESS":
			newState = copyState(state);
			newState.downloading[action.id] = action.progress;
			return newState;

		case "SET_TIMER":
			newState = copyState(state);
			newState.timer = action.timer;
			return newState;

		default:
			return state;

	}
}

export default reducer;
