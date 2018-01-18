import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import FileSaver from 'file-saver';
import CircularProgressbar from 'react-circular-progressbar';

class Advanced extends React.Component {

	constructor() {
		super();
		this.state = {
			showing: false,
			modalOpen: false,
			progress: 0,
			videoCount: 0,
			curVideo: 0,
			id: '',
			title: 'untitled'
		};
	}

	setShowing(bool) {
		this.setState({showing: bool});
	}

	setModalOpen(bool) {
		this.setState({modalOpen: bool});
	}

	setProgress(n) {
		this.setState({progress: n});
	}

	setCurInfo(videoCount, curVideo) {
		this.setState({
			videoCount,
			curVideo
		});
	}

	setVideoTitle(title) {
		this.setState({
			title
		});
	}

	getVideoTitle(id) {
		return new Promise((resolve) => { // no reject
			fetch('/api/getVideoTitle/' + id)
				.then((res) => {
					return res.text();
				})
				.then((title) => {
					resolve(title);
				});
		});
	}

	submitPlaylist(e) {
		e.preventDefault();
		let text = this.refs.searchBar.value;
		if(text && text != '') {
			// abort because id is invalid, do error logging
			console.log('ready to socket');
			this.setModalOpen(true);
			return; // delete this
		} else {
			console.log('aborting');
			return;
		}
		let id = text.trim(),
			url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081',
			blob;
		const socket = io(url);
		this.socket = socket;
		socket.emit('request_playlist', {id});
		socket.on('video_id', (id) => {
			this.getVideoTitle(id)
				.then((title) => {
					console.log('SETTING VIDEO TITLE');
					this.setVideoTitle(title);
				});
		});
		socket.on('progress', (progress_string) => {
			this.setProgress(parseInt(progress_string));
		});
		socket.on('cur_info', (videoCount, curVideo, filename) => {
			console.log(videoCount, curVideo, filename);
			this.setCurInfo(videoCount, curVideo, filename);
		});
		socket.on('file_ready', (file, id) => {
			this.getVideoTitle(id)
				.then((title) => {
					console.log(title);
					blob = new Blob([new Uint8Array(file)]);
					FileSaver.saveAs(blob, title + '.mp3');
					console.log('emmitting file received');
					socket.emit('file_received');
				});
		});
		socket.on('request_complete', () => {
			this.setModalOpen(false);
			socket.close();
		});
		socket.on('request_error', (error) => {
			console.log(error);
			this.setModalOpen(false);
			socket.close();
		});
	}

	renderModalIfShowing() {
		if(this.state.modalOpen == true) {
			return (
				<div className='advanced-modal-container'>
					<div className='advanced-modal-wrapper'>
						<p>Video {this.state.curVideo} of {this.state.videoCount}</p>
						<p>{this.state.title}</p>
						<CircularProgressbar percentage={this.state.progress} className='progress-audio' />
					</div>
				</div>
			);
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
				{this.renderModalIfShowing()}
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
