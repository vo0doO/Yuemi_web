export const updateSearchResults = (videos) => {
	return {
		type: 'UPDATE_SEARCH_RESULTS',
		videos
	};
};

export const updateSearchText = (text) => {
	return {
		type: 'UPDATE_SEARCH_TEXT',
		text
	};
};

export const setLoading = (bool) => {
	return {
		type: 'SET_LOADING',
		bool
	};
};

export const setTimer = (timer) => {
	return {
		type: 'SET_TIMER',
		timer
	};
};
