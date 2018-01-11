import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import DownloadsContainer, { Downloads } from './Downloads.js';

import { updateFeed } from './FeedActions.js';

describe('Downloads', () => {

	const initialState = {
	};
	const store = configureStore()(initialState);
	let wrapper;

	beforeEach(() => {
		wrapper = mount (
			<Provider store={store}>
				<DownloadsContainer />
			</Provider>
		);
	});

	describe('Downloads', () => {
	});

});
