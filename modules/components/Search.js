import React from "react";

class Search extends React.Component {

	componentDidMount(){
		this.refs.searchText.focus()
	}
	
	search(e){
		e.preventDefault();
		let searchText = this.refs.searchText.value;
		let url = '/api/search/' + searchText;
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
			<form onSubmit={this.search.bind(this)}>
				<input type="text" ref="searchText"/>
				<input type="submit" value="Submit"/>
			</form>
		)
	}
}

export default Search;
