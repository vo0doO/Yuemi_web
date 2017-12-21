import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import App from "./src/App.js";
import appReducer from "./src/appReducer.js";
import { createLogger } from "redux-logger";

const logger = createLogger();
const useLogger = false;
let store;

if(useLogger == true){
	store = createStore(
		appReducer,
		applyMiddleware(thunk, logger)
	);
} else {
	store = createStore(appReducer);
}

const app = document.getElementById("app");
ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>
	, app);
