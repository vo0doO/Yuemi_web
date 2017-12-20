import React from "react";
import { connect } from "react-redux";

import { addDownload, removeDownload, setProgress } from "../actions/action.js";
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
		addDownload: (id) => {
			dispatch(addDownload(id))
		},
		removeDownload: (id) => {
			dispatch(removeDownload(id))
		},
		setProgress: (id, progress) => {
			dispatch(setProgress(id, progress))
		}
	};
}

const SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);
export default SearchResultsContainer;
