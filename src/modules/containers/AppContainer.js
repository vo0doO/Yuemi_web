import React from "react";
import { connect } from "react-redux";

import App from "../components/App.js";

const mapStateToProps = (state) => {
	return {
		state: state,
	};
}

const AppContainer = connect(mapStateToProps)(App);
export default AppContainer;
