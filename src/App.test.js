import React from 'react';
import { mount } from 'enzyme';
import App from './App.js';
import store from './store.js';

describe('App', () => {
	const app = mount (
		<App />, {
			context: { store }
		});
	it('always renders base-container div', () => {
		const divs = app.find('.base-container');
		expect(divs.length).toEqual(1);
	});
	describe('the base-container div', () => {
		it('contains everything else that gets rendered', () => {
			const divs = app.find('div');
			const innerDivs = app.find('.base-container').children();
			expect(innerDivs.length).toEqual(divs.length - 2);
		});
	});
});
