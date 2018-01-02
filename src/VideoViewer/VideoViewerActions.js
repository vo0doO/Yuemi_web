export const setVideoViewer = (bool, video) => {
	return {
		type: 'SET_VIDEO_VIEWER',
		bool,
		video
	};
};
