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
			curVideo: 0
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

	getVideoTitle(id) {
		return new Promise((resolve) => { // no reject
			fetch('/api/getVideoTitle/' + id)
				.then((res) => {
					return res.text();
				})
				.then((title) => {
					resolve(decodeURIComponent(title.replace(/\+/g, '%20')));
				});
		});
	}

	downloadFile() {
		console.log('WIP');
		return;
	}

	downloadPlaylist() {
		let text = this.refs.playlistInput.value;
		if(text && text != '') {
			// abort because id is invalid, do error logging
			this.setModalOpen(true);
		} else {
			return;
		}
		let id = text.trim(),
			url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081',
			blob;
		const socket = io(url);
		this.socket = socket;
		socket.emit('request_playlist', {id});
		socket.on('progress', (progress_string) => {
			this.setProgress(parseInt(progress_string));
		});
		socket.on('cur_info', (videoCount, curVideo, filename) => {
			this.setCurInfo(videoCount, curVideo, filename);
		});
		socket.on('file_ready', (file, id) => {
			this.getVideoTitle(id)
				.then((title) => {
					this.setProgress(0);
					blob = new Blob([new Uint8Array(file)]);
					FileSaver.saveAs(blob, title + '.mp3');
					socket.emit('file_received');
				});
		});
		socket.on('request_complete', () => {
			this.setModalOpen(false);
			this.refs.playlistInput.value = '';
			this.setShowing(false);
			this.setCurInfo(0, 0);
			this.setProgress(0);
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
						<div className='advanced-modal-left'>
							<p>Video {this.state.curVideo} of {this.state.videoCount}</p>
						</div>
						<div className='advanced-modal-right'>
							<CircularProgressbar percentage={this.state.progress} className='progress-audio' />
						</div>
					</div>
				</div>
			);
		}
	}

	renderOptionsIfShowing() {
		if(this.state.showing) {
			return (
				<div className='advanced-options-container'>
					<div className='advanced-options-wrapper'>
						<div className='advanced-options-inner-container'>
							<p>Download Public Playlist</p>
							<input
								placeholder={'Playlist ID'}
								ref={'playlistInput'}
								spellCheck={false}
							/>
							<a className='download-button-audio'>
								<i className='fa fa-download ' onClick={this.downloadPlaylist.bind(this)}></i>
							</a>
						</div>
						<div className='advanced-options-inner-container'>
							<p>Download From File</p>
							<input
								placeholder={'File Contents'}
								ref={'fileInput'}
								spellCheck={false}
							/>
							<a className='download-button-audio'>
								<i className='fa fa-download ' onClick={this.downloadFile.bind(this)}></i>
							</a>
						</div>
					</div>
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
