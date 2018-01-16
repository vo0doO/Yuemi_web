import React from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import io from 'socket.io-client';
import { setActive, removeDownload, setProgress } from './DownloadActions.js';
import { getFeed } from '../lib/feed.js';
import { updateFeed } from '../AppActions.js';

class DownloadRow extends React.Component {

	componentDidMount() {
		const data = this.props.data; // a video/audio object
		const mediaType = this.props.mediaType;
		let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
		const socket = io(url);
		this.socket = socket;
		if (!data.active) {
			socket.emit('request_file', { id: data._id, mediaType, data });
			this.props.setActive(mediaType, data._id);
			this.addDownloadToFeed(data);
		}
		// no error handling yet
		socket.on('progress', (progress_string) => {
			this.props.setProgress(mediaType, data._id, parseInt(progress_string));
		});
		socket.on('request_complete', () => {
			let id = encodeURIComponent(data._id);
			let title = encodeURIComponent(data.title);
			let url = `/api/getFile/WEB/${mediaType}/${id}/${title}`;
			window.location.assign(url);
			this.props.removeDownload(mediaType, data._id);
			getFeed(this.props.updateFeed);
			socket.close();
		});
		socket.on('error', (error) => {
			console.log(error);
			this.props.removeDownload(mediaType, data._id);
			socket.close();
		});
	}

	cancelDownload() {
		this.props.removeDownload(this.props.mediaType, this.props.data._id);
		this.socket.close();
	}

	addDownloadToFeed(data) {
		let { _id, title, duration, uploader, views } = data;
		fetch('/api/downloads', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				_id,
				title,
				duration,
				uploader,
				views
			})
		})
			.then((res) => {
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		return (
			<li>
				<p>
					{this.props.data.title}
				</p>
				<div>
					<a className={'progress-' + this.props.mediaType} onClick={this.cancelDownload.bind(this)}>
						<i className='fa fa-times-circle-o'></i>
					</a>
					<a>
						<CircularProgressbar percentage={this.props.data.progress} className={'progress-' + this.props.mediaType} />
					</a>
				</div>
			</li>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setActive: (mediaType, id) => {
			dispatch(setActive(mediaType, id));
		},
		removeDownload: (mediaType, id) => {
			dispatch(removeDownload(mediaType, id));
		},
		setProgress: (mediaType, id, progress) => {
			dispatch(setProgress(mediaType, id, progress));
		},
		updateFeed: (json) => {
			dispatch(updateFeed(json));
		}
	};
};

export default connect(null, mapDispatchToProps)(DownloadRow);
