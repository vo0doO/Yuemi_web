export const addDownload = (media_type, _id, bundle) => {
	return {
		type: 'ADD_DOWNLOAD',
		media_type,
		_id,
		bundle
	};
};

export const removeDownload = (_id) => {
	return {
		type: 'REMOVE_DOWNLOAD',
		_id
	};
};

export const setProgress = (_id, progress) => {
	return {
		type: 'SET_PROGRESS',
		_id,
		progress
	};
};

export const setActive = (_id) => {
	return {
		type: 'SET_ACTIVE',
		_id
	};
};
