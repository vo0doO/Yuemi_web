import React from "react";
import SearchBar from "./SearchBar.js";

class Search extends React.Component {
	
	search(text){
		if(text == '') {
			return;
		}
		let url = '/api/search/' + text;
		this.props.setLoading(true);
		fetch(url)
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.props.setLoading(false);
				this.props.updateSearchResults(json.videos);
			})
	}

	render(){
		return (
			<div>
				<SearchBar submit={this.search.bind(this)}/>
			</div>
		)
	}
}

export default Search;
