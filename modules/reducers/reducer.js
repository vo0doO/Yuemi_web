const getInitialState = () => {
	return {
		searchResults: [],
		loading: false
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

		default:
			return state;

	}
}

export default reducer;
