import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import AppContainer from "../modules/containers/AppContainer.js";
import reducer from "../modules/reducers/reducer.js";
import { createLogger } from "redux-logger";

const logger = createLogger();
const useLogger = false;
let store;

if(useLogger == true){
	store = createStore(
		reducer,
		applyMiddleware(thunk, logger)
	);
} else {
	store = createStore(reducer);
}

const app = document.getElementById("app");
ReactDOM.render(
	<Provider store={store}>
		<AppContainer/>
	</Provider>
	, app);
