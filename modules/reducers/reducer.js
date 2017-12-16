const getInitialState = () => {
	return {
		searchResults: [

{"title":"Utada Hikaru - Anata (Short Version)","id":"A37bu5BFaWs","duration":"2:26"},{"title":"Utada Hikaru - Forevermore","id":"RQG2kRd9SpE","duration":"1:38"},{"title":"宇多田ヒカル - Passion ～single version～","id":"kWoJLdXJt0E","duration":"4:41"},{"title":"宇多田ヒカル - SAKURAドロップス","id":"jYDM0sYfqnM","duration":"5:08"},{"title":"宇多田ヒカル - 二時間だけのバカンス featuring 椎名林檎","id":"UPdlfIhzPEo","duration":"4:49"},{"title":"Utada - Come Back To Me","id":"CKPA8L5ZpqU","duration":"4:17"},{"title":"Utada Hikaru - Sanctuary (Lyrics)","id":"ytVIHARbuK4","duration":"4:17"},{"title":"宇多田ヒカル「忘却 featuring KOHH」MUSIC VIDEO","id":"SmaeIlqqNCM","duration":"5:07"},{"title":"Kingdom Hearts 3 News - It Looks Like Utada Hikaru is Returning!","id":"U-rOwYucW1s","duration":"4:52"},{"title":"Lyris to Simple and Clean by Utada Hikaru","id":"v0xbO5LAnjc","duration":"5:01"},{"title":"宇多田ヒカル - Flavor Of Life -Ballad Version-","id":"3Ta0vEnki9E","duration":"5:38"},{"title":"宇多田ヒカル - Goodbye Happiness","id":"cfpX8lkaSdk","duration":"5:55"},{"title":"宇多田ヒカル - Automatic","id":"-9DxpPiE458","duration":"4:17"},{"title":"宇多田ヒカル - 光","id":"AlMdDpUWFFI","duration":"4:23"},{"title":"宇多田ヒカル - traveling","id":"tuyZ9f6mHZk","duration":"4:55"},{"title":"Utada Hikaru -Sakura Drops","id":"2nVZV-2sjBQ","duration":"4:59"},{"title":"Kingdom Hearts Ending LIVE Utada Hikaru   Simple and Clean","id":"B5rIpOmuD7U","duration":"6:00"}


		],
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
