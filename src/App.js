import React from 'react';
import { connect } from 'react-redux';
import './app.scss';
import Search from './Search/Search.js';
import SearchResults from './Search/SearchResults.js';
import Downloads from './Downloads/Downloads.js';
import Feed from './Feed/Feed.js';

const mapStateToProps = (state) => {
	return {
		loading: state.loading,
		searchResults: state.searchResults
	};
};

class App extends React.Component {

	renderComponent() {
		return this.props.loading || this.props.searchResults.length > 0 ? <SearchResults /> : <Feed />;
	}

	render() {
		return (
			<div className='base-container'>
				<Search />
				{this.renderComponent()}
				<Downloads />
			</div>
		);
	}
}

export default connect(mapStateToProps)(App);
