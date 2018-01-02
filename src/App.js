import React from 'react';
import { connect } from 'react-redux';
import './app.scss';
import Search from './Search/Search.js';
import VideoList from './VideoList/VideoList.js';
import Downloads from './Downloads/Downloads.js';
import { updateFeed } from './AppActions.js';

class App extends React.Component {

	componentWillMount() {
		fetch('/api/downloads')
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.props.updateFeed(json);
			});
	}

	render() {
		return (
			<div className='base-container'>
				<Search />
				<VideoList videoList={this.props.searchResults.length > 0 ? this.props.searchResults : this.props.feed} />
				<Downloads />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.loading,
		searchResults: state.searchResults,
		feed: state.feed
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
