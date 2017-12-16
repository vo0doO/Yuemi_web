import React from "react";
import { connect } from "react-redux";

import Search from "../components/Search.js";
import { updateSearchResults, setLoading, setTimer } from "../actions/action.js";

const mapStateToProps = (state) => {
	return {
		timer: state.timer
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateSearchResults: (videos) => {
			dispatch(updateSearchResults(videos));
		},
		setLoading: (bool) => {
			dispatch(setLoading(bool))
		},
		setTimer: (timer) => {
			dispatch(setTimer(timer))
		}
	}
}

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(Search);
export default SearchContainer;
