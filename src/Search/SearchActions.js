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

export const addDownload = (id) => {
	return {
		type: "ADD_DOWNLOAD",
		id
	}
}

export const removeDownload = (id) => {
	return {
		type: "REMOVE_DOWNLOAD",
		id
	}
}

export const setProgress = (id, progress) => {
	return {
		type: "SET_PROGRESS",
		id,
		progress
	}
}

export const setTimer = (timer) => {
	return {
		type: "SET_TIMER",
		timer
	}
}