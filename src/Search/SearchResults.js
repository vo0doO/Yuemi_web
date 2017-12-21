import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { addDownload } from "../Downloads/DownloadActions.js";
import SearchRow from "./SearchRow";

class SearchResults extends React.Component {

	download(result) {
		this.props.addDownload(result.id, result);
	}

	renderResults() {
		let results = this.props.results;
		return results.map((result) => {
			if (!_.hasIn(this.props.downloading, result.id) && !_.hasIn(this.props.downloaded, result.id)) {
				return (
					<SearchRow result={result} download={this.download.bind(this)} key={result.id} />
				)
			}
		})
	}

	renderContent() {
		if (this.props.loading) {
			return (
				<div className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			)
		} else if (this.props.results.length > 0) {
			return (
				<ul>
					{this.renderResults()}
				</ul>
			)
		} else {
			return (
				<div className="search-results-placeholder">
					<h1>Feed</h1>
				</div>
			)
		}
	}

	render() {
		return (
			<div className="search-results">
				{this.renderContent()}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading,
		downloaded: state.downloaded,
		progress: state.progress
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addDownload: (id, bundle) => {
			dispatch(addDownload(id, bundle))
		},
		removeDownload: (id) => {
			dispatch(removeDownload(id))
		},
		setProgress: (id, progress) => {
			dispatch(setProgress(id, progress))
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);