export const addDownload = (mediaType, _id, bundle) => {
	return {
		type: 'ADD_DOWNLOAD',
		mediaType,
		_id,
		bundle
	};
};

export const removeDownload = (mediaType, _id) => {
	return {
		type: 'REMOVE_DOWNLOAD',
		mediaType,
		_id
	};
};

export const setProgress = (mediaType, _id, progress) => {
	return {
		type: 'SET_PROGRESS',
		mediaType,
		_id,
		progress
	};
};

export const setActive = (mediaType, _id) => {
	return {
		type: 'SET_ACTIVE',
		mediaType,
		_id
	};
};
