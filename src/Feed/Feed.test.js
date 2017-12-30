import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import FeedContainer, { Feed } from './Feed.js';

import { updateFeed } from './FeedActions.js';

describe('Feed', () => {

	const initialState = {
		downloading: {},
		feed: []
	};
	const store = configureStore()(initialState);
	let wrapper;

	beforeEach(() => {
		wrapper = mount (
			<Provider store={store}>
				<FeedContainer />
			</Provider>
		);
	});

	describe('Feed', () => {
		it('receives specific props', () => {
			expect(Object.keys(wrapper.find(Feed).props())).toEqual(['feed', 'downloading', 'updateFeed']); //feels too verbose
		});
		it('receives empty feed list', () => {
			expect(wrapper.find(Feed).prop('feed')).toEqual([]);
		});
		it('dispatches correctly', () => {
			store.dispatch(updateFeed([{
				'_id':'UPdlfIhzPEo',
				'__v':0,
				'createdAt':'2017-12-30T04:02:21.508Z',
				'downloads':7,
				'duration':'4:49',
				'title':'宇多田ヒカル - 二時間だけのバカンス featuring 椎名林檎',
				'updatedAt':'2017-12-30T09:29:49.723Z',
				'uploader':'UtadaHikaruVEVO',
				'views':'7,516,883 views'
			}]));
			expect(store.getActions()[0].type).toBe('UPDATE_FEED');
			expect(wrapper.find(Feed).find('ul').length).toEqual(1);
		});
	});

});
