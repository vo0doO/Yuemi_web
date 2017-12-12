import React from "react";

class App extends React.Component {

	componentDidMount(){
		this.refs.searchText.focus()
	}
	
	search(e){
		e.preventDefault();
		let searchText = this.refs.searchText.value;
		let url = '/api/hello'
		fetch(url)
			.then(response => {
				return response.text();
			})
			.then(text => {
				console.log(text);
			})
	}

	render(){
		return (
			<div className="baseContainer">
				<form onSubmit={this.search.bind(this)}>
					<input type="text" ref="searchText"/>
					<input type="submit" value="Submit"/>
				</form>
			</div>
		)
	}
}

export default App;
