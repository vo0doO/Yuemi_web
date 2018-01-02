import React from 'react';
import { addDownload } from '../Downloads/DownloadActions.js';
import { setVideoViewer } from '../VideoViewer/VideoViewerActions.js';
import { connect } from 'react-redux';

class VideoListRow extends React.Component {

	download(video) {
		this.props.addDownload(video._id, video);
	}

	pixelate(c, src) { // thumbnail pixelation is an unpopular feature, consider removing
		if (!c) {
			return; // check if memory usage is bad
		}
		var ctx = c.getContext('2d'),
			img = new Image(); // check if memory usage is bad
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		img.onload = pixelate;
		img.src = src;
		function pixelate() {
			var size = .08,
				w = c.width * size,
				h = c.height * size;
			ctx.drawImage(img, 0, 0, w, h);
			ctx.drawImage(c, 0, 0, w, h, 0, 0, c.width, c.height);
		}
		return c;
	}

	showVideoViewer() {
		this.props.setVideoViewer(true, this.props.video);
	}

	hasBeenDownloaded(id) {
		return Object.keys(this.props.downloaded).indexOf(id) != -1 || Object.keys(this.props.downloading).indexOf(id) != -1;
	}

	render() {
		const video = this.props.video;
		let src = 'https://img.youtube.com/vi/' + video._id + '/mqdefault.jpg';
		return (
			<li className={this.hasBeenDownloaded(video._id) ? 'downloaded' : 'not-downloaded'}>
				<div className='left'>
					<div className='left-image'>
						<canvas ref={(c) => { this.pixelate(c, src); }} width='100' height='75'></canvas>
					</div>
					<div className='left-text'>
						<p onClick={this.showVideoViewer.bind(this)}>{video.title}</p>
						<div>
							<p className='uploader'>{video.uploader}</p>
							<p className='duration'>{video.duration}</p>
						</div>
						<p className='views'>{video.views}</p>
					</div>
				</div>
				{!this.hasBeenDownloaded(video._id) && (
					<a onClick={() => this.download(video)}>
						<i className='fa fa-download'></i>
					</a>
				)}
			</li>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		downloaded: state.downloaded,
		downloading: state.downloading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDownload: (id, bundle) => {
			dispatch(addDownload(id, bundle));
		},
		setVideoViewer: (bool, video) => {
			dispatch(setVideoViewer(bool, video));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoListRow);
