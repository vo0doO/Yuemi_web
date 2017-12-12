import React from "react";
import { connect } from "react-redux";
import { changeStage } from "../actions/action.js";

import App from "../components/App.js";

const mapStateToProps = (state) => {
	return {
		state: state,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		exampleDispatch: (data) => {
			dispatch(exampleAction(data))
		},
	};
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
