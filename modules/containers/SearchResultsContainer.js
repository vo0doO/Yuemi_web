import React from "react";
import { connect } from "react-redux";

import { setDownloading, setProgress } from "../actions/action.js";
import SearchResults from "../components/SearchResults.js";

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading,
		progress: state.progress
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setDownloading: (id) => {
			dispatch(setDownloading(id))
		},
		setProgress: (progress) => {
			dispatch(setProgress(progress))
		}
	};
}

const SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);
export default SearchResultsContainer;
