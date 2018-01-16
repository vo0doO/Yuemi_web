import React from 'react';
import { connect } from 'react-redux';
import './app.scss';
import Search from './Search/Search.js';
import VideoList from './VideoList/VideoList.js';
import VideoViewer from './VideoViewer/VideoViewer.js';
import Downloads from './Downloads/Downloads.js';
import { updateFeed } from './AppActions.js';
import { getFeed } from './lib/feed.js';

class App extends React.Component {

	_getVideoList() {
		if(this.props.searchResults.length < 1 && this.props.searchText.length > 0 && !this.props.loading) {
			return (
				<h1 className='header-text-grey'>No Videos Found</h1>
			);
		} else if(this.props.searchResults.length > 0 || this.props.loading) {
			return (
				<VideoList videoList={this.props.searchResults} />
			);
		} else {
			return (
				<div className='feed-container'>
					<div className="feed-wrapper">
						<h1 className='header-text-grey'>Recently Downloaded</h1>
						<VideoList videoList={this.props.feed} />
					</div>
				</div>
			);
		}
	}

	componentWillMount() {
		getFeed(this.props.updateFeed);
	}

	render() {
		return (
			<div className='base-container'>
				<Search />
				{this._getVideoList()}
				<Downloads />
				<VideoViewer />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.loading,
		searchResults: state.searchResults,
		feed: state.feed,
		searchText: state.searchText
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateFeed: (feed) => {
			dispatch(updateFeed(feed));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
