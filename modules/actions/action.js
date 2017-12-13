export const updateSearchResults = (videos) => {
	return {
		type: "UPDATE_SEARCH_RESULTS",
		videos
	}
}

export const setLoading = (bool) => {
	return {
		type: "SET_LOADING",
		bool
	}
}
