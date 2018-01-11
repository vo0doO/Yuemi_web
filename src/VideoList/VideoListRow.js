import React from 'react';
import { addDownload } from '../Downloads/DownloadActions.js';
import { setVideoViewer } from '../VideoViewer/VideoViewerActions.js';
import { connect } from 'react-redux';

class VideoListRow extends React.Component {

	download(video, mediaType) {
		this.props.addDownload(mediaType, video._id, video);
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

	concatenatePropKeys(propName) {
		let audioList = Object.keys(this.props[propName].audio);
		let videoList = Object.keys(this.props[propName].video);
		return videoList.concat(audioList);
	}

	hasBeenDownloaded(id) {
		return this.concatenatePropKeys('downloaded').indexOf(id) != -1 || this.concatenatePropKeys('downloading').indexOf(id) != -1;
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
						<p className='title' onClick={this.showVideoViewer.bind(this)}>{video.title}</p>
						<p className='uploader'>{video.uploader}</p>
						<p className='duration'>{video.duration}</p>
						<p className='views'>{video.views}</p>
					</div>
				</div>
				{!this.hasBeenDownloaded(video._id) && (
					<div className='download-buttons-container'>
						<a className='download-button-audio' onClick={() => this.download(video, 'audio')}>
							<i className='fa fa-download'></i>
						</a>
						<a className='download-button-video' onClick={() => this.download(video, 'video')}>
							<i className='fa fa-download'></i>
						</a>
					</div>
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
		addDownload: (mediaType, id, video) => {
			dispatch(addDownload(mediaType, id, video));
		},
		setVideoViewer: (bool, video) => {
			dispatch(setVideoViewer(bool, video));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoListRow);
