import React from "react";

class SearchBar extends React.Component {
	constructor() {
		super();
		this.state = {
			inputValue: ''
		};
		this.onInputChange = this.onInputChange.bind(this);
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
					onChange={this.onInputChange}
					placeholder='Search...'
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
