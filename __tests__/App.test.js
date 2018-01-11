import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import App from './App.js';
import Downloads from './Downloads/Downloads.js';
import Search from './Search/Search.js';

describe('App', () => {

	const initialState = {
		searchResults: [],
		loading: false,
		timer: null,
		downloading: {},
		downloaded: {},
		feed: []
	};
	const store = configureStore()(initialState);
	let wrapper;

	beforeEach(() => {
		wrapper = mount (
			<Provider store={store}>
				<App />
			</Provider>
		);
	});

	it('always renders base-container div', () => {
		const divs = wrapper.find('.base-container');
		expect(divs.length).toEqual(1);
	});
	it('receives no props', () => {
		expect(wrapper.find(App).props()).toEqual({});
	});

	describe('the base-container div', () => {
		it('contains everything else that gets rendered', () => {
			const divs = wrapper.find('div');
			const innerDivs = wrapper.find('.base-container').children();
			expect(innerDivs.length).toEqual(divs.length - 2);
		});
		it('always renders <Downloads />', () => {
			expect(wrapper.find(Downloads).length).toBe(1);
		});
		it('always renders <Search />', () => {
			expect(wrapper.find(Search).length).toBe(1);
		});
	});

});
