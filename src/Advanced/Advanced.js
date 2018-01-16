import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import FileSaver from 'file-saver';

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
			// abort because id is invalid, do error logging
			console.log('ready to socket');
		} else {
			console.log('aborting');
			return;
		}
		let id = text.trim();
		let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
		let blob;
		const socket = io(url);
		this.socket = socket;
		socket.emit('request_playlist', {id});
		socket.on('progress', (progress_string) => {
			console.log(progress_string);
		});
		socket.on('file_ready', (file, filename) => {
			// will need to save file
			console.log(file);
			blob = new Blob([new Uint8Array(file)]);
			FileSaver.saveAs(blob, filename);
		});
		socket.on('request_complete', () => {
			socket.close();
		});
		socket.on('error', (error) => {
			console.log(error);
			socket.close();
		});


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
