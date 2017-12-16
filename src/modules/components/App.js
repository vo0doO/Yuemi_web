import React from "react";
import "../scss/app.scss"

import SearchContainer from "../containers/SearchContainer.js";
import SearchResultsContainer from "../containers/SearchResultsContainer.js";

class App extends React.Component {

	render(){
		return (
			<div className="baseContainer">
				<SearchContainer/>
				<SearchResultsContainer/>
			</div>
		)
	}
}

export default App;
