import React from "react";
import { connect } from "react-redux";

import SearchResults from "../components/SearchResults.js";

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		exampleDispatch: (data) => {
			dispatch(exampleAction(data))
		}
	};
}

const SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);
export default SearchResultsContainer;
