const getInitialState = () => {
	return {
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

		case "exampleAction":
			return state;

		default:
			return state;

	}
}

export default reducer;
