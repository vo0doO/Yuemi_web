import React from "react";
import "../scss/app.scss"

import SearchContainer from "../containers/SearchContainer.js";
import SearchResultsContainer from "../containers/SearchResultsContainer.js";

class App extends React.Component {

	render(){
		return (
			<div className="base-container">
				<SearchContainer/>
				<SearchResultsContainer/>
			</div>
		)
	}
}

export default App;
