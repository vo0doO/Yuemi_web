import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Row from '../Row/Row.js';

class SearchResults extends React.Component {

	renderResults() {
		let results = this.props.results;
		return results.map((result) => {
			if (!_.hasIn(this.props.downloading, result.id) && !_.hasIn(this.props.downloaded, result.id)) {
				return (
					<Row data={result} key={result.id} />
				);
			}
		});
	} // MOVE DOWNLOAD TO ROW

	renderContent() {
		let dlen = Object.keys(this.props.downloading).length;
		if (this.props.loading) {
			return (
				<div className='spinner'>
					<div className='bounce1'></div>
					<div className='bounce2'></div>
					<div className='bounce3'></div>
				</div>
			);
		} else if (this.props.results.length > 0) {
			return (
				<ul style={{ 'marginBottom': dlen * 50 }}>
					{this.renderResults()}
				</ul>
			);
		}
	}

	render() {
		return (
			<div className='search-results'>
				{this.renderContent()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading,
		downloaded: state.downloaded,
		progress: state.progress
	};
};

export default connect(mapStateToProps)(SearchResults);
