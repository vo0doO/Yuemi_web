import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import appReducer from './appReducer.js';
import { createLogger } from 'redux-logger';

const logger = createLogger();
const useLogger = false;
let store;

if (useLogger == true) {
	store = createStore(
		appReducer,
		applyMiddleware(thunk, logger)
	);
} else {
	store = createStore(appReducer);
}

export default store;
