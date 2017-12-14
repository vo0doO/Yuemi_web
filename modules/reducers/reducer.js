const getInitialState = () => {
	return {
		searchResults: [],
		loading: false,
		downloading: null,
		progress: 0
	}
}

const copyState = (state) => {
	return (
		Object.assign({}, state)
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

		case "SET_DOWNLOADING":
			newState = copyState(state);
			newState.downloading = action.id;
			return newState;

		case "SET_PROGRESS":
			newState = copyState(state);
			newState.progress = action.progress;
			return newState;

		default:
			return state;

	}
}

export default reducer;
