import React from "react";
import SearchBar from "./SearchBar.js";

class Search extends React.Component {
	
	handleInput(text) {
		this.props.setLoading(true);
		clearTimeout(this.props.timer);
		this.props.setTimer(setTimeout(() => this.search(text), 1000));
	}

	search(text) {
		if(text == '') {
			this.props.setLoading(false);
			return;
		}
		let url = '/api/search/' + encodeURIComponent(text);
		fetch(url)
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.props.setLoading(false);
				this.props.updateSearchResults(json.videos);
			})
	}

	render() {
		return (
			<div>
				<SearchBar submit={this.handleInput.bind(this)}/>
			</div>
		)
	}
}

export default Search;
