import React from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import io from 'socket.io-client';
import { setActive, removeDownload, setProgress } from './DownloadActions.js';

class DownloadRow extends React.Component {

	componentDidMount() {
		const data = this.props.data; // a video object
		const mediaType = this.props.mediaType;
		let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
		const socket = io(url);
		this.socket = socket;
		if (!data.active) {
			socket.emit('request_file', { id: data._id, media_type: mediaType.toUpperCase() });
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
			let url;
			if(mediaType == 'video') {
				url = `/api/getFile/WEB/VIDEO/${id}/${title}`;
			} else {
				url = `/api/getFile/WEB/AUDIO/${id}/${title}`;
			}
			window.location.assign(url);
			this.props.removeDownload(mediaType, data._id);
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

const mapStateToProps = (state) => {
	return {
		downloads: state.downloads,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setActive: (media_type, id) => {
			dispatch(setActive(media_type, id));
		},
		removeDownload: (media_type, id) => {
			dispatch(removeDownload(media_type, id));
		},
		setProgress: (media_type, id, progress) => {
			dispatch(setProgress(media_type, id, progress));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadRow);
