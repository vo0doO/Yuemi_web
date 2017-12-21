import React from "react";
import { connect } from "react-redux";
import "./app.scss"
import Search from "./Search/Search.js";
import SearchResults from "./Search/SearchResults.js";
import Downlaods from "./Downloads/Downloads.js";

const mapStateToProps = (state) => {
	return {
		state
	};
}


class App extends React.Component {

	render() {
		return (
			<div className="base-container">
				<Search />
				<SearchResults />
				<Downlaods />
			</div>
		)
	}
}

export default connect(mapStateToProps)(App);
