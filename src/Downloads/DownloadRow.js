import React from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import io from 'socket.io-client';
import { setActive, removeDownload, setProgress } from './DownloadActions.js';

class DownloadRow extends React.Component {

	componentDidMount() {
		const data = this.props.data;
		let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
		const socket = io(url);
		if (!data.active) {
			socket.emit('request_file', data._id);
			this.props.setActive(data._id);
			this.addDownloadToFeed(data);
		}
		// no error handling yet
		socket.on('progress', (progress_string) => {
			this.props.setProgress(data._id, parseInt(progress_string));
		});
		socket.on('request_complete', () => {
			let id = encodeURIComponent(data._id);
			let title = encodeURIComponent(data.title);
			let url = `/api/getFile/WEB/${id}/${title}`;
			window.location.assign(url);
			this.props.removeDownload(data._id);
			socket.close();
		});
		socket.on('error', (error) => {
			console.log(error);
			this.props.removeDownload(data._id);
			socket.close();
		});
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
				<a>
					<CircularProgressbar percentage={this.props.data.progress} />
				</a>
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
		setActive: (id) => {
			dispatch(setActive(id));
		},
		removeDownload: (id) => {
			dispatch(removeDownload(id));
		},
		setProgress: (id, progress) => {
			dispatch(setProgress(id, progress));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadRow);
