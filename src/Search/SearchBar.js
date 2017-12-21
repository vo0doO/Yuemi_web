import React from "react";

class SearchBar extends React.Component {
	constructor() {
		super();
		this.state = {
			inputValue: ''
		};
		this.onInputChange = this.onInputChange.bind(this);
	}

	componentDidMount() {
		this.refs.searchBar.focus();
	}

	onInputChange(e) {
		const { value } = e.target;
		this.setState({
			inputValue: value
		});
		this.props.submit(value);
	}

	render() {
		const { inputValue } = this.state;
		return (
			<div className='input-wrapper'>
				<input
					placeholder={'Search for music'}
					ref={'searchBar'}
					onChange={this.onInputChange}
					value={inputValue}
					spellCheck={false}
				/>
				<span className='input-highlight'>
					{ inputValue.replace(/ /g, "\u00a0") }
				</span>
			</div>
		);
	}
}

export default SearchBar;
