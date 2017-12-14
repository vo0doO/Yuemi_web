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

export const setDownloading = (id) => {
	return {
		type: "SET_DOWNLOADING",
		id
	}
}

export const setProgress = (progress) => {
	return {
		type: "SET_PROGRESS",
		progress
	}
}
