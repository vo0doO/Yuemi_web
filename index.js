import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './src/App.js';
import store from './src/store.js';

const app = document.getElementById('app');
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, app);
