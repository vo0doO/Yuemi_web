import React from "react";
import { connect } from "react-redux";

import Search from "../components/Search.js";
import { updateSearchResults, setLoading } from "../actions/action.js";

const mapStateToProps = (state) => {
	return {
		state: state
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateSearchResults: (videos) => {
			dispatch(updateSearchResults(videos));
		},
		setLoading: (bool) => {
			dispatch(setLoading(bool))
		}
	}
}

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);
export default SearchContainer;
