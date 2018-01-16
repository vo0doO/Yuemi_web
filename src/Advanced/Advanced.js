import React from 'react';
import { connect } from 'react-redux';

class Advanced extends React.Component {

	constructor() {
		super();
		this.state = {
			showing: false
		};
	}

	setShowing(bool) {
		this.setState({showing: bool});
	}

	submitPlaylist(e) {
		e.preventDefault();
		let text = this.refs.searchBar.value;
		if(text && text != '') {
			this.props.download
		}
	}

	renderOptionsIfShowing() {
		if(this.state.showing) {
			return (
				<div className='advanced-options-container'>
					<div>
						<p>Download Public Playlist:</p>
						<form onSubmit={this.submitPlaylist.bind(this)}>
							<input
								placeholder={'Input public playlist id'}
								ref={'searchBar'}
								spellCheck={false}
								onSubmit={this.submitPlaylist.bind(this)}
							/>
							<button type='submit'>Download</button>
						</form>
					</div>
					<p>Download From File:</p>
				</div>
			);
		}
	}

	renderCaret() {
		if(this.state.showing) {
			return (
				<i className="advanced-button fa fa-caret-up" aria-hidden="true" onClick={this.setShowing.bind(this, false)}></i>
			);
		} else {
			return (
				<i className="advanced-button fa fa-caret-down" aria-hidden="true" onClick={this.setShowing.bind(this, true)}></i>
			);
		}
	}

	render() {
		return (
			<div id='advanced'>
				{this.renderCaret()}
				{this.renderOptionsIfShowing()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		downloading: state.downloading
	};
};

export { Advanced };
export default connect(mapStateToProps)(Advanced);
