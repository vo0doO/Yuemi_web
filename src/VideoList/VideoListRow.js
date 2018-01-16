import React from 'react';
import { addDownload } from '../Downloads/DownloadActions.js';
import { setVideoViewer } from '../VideoViewer/VideoViewerActions.js';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';

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

	_getDownloadCount() {
		if(this.props.video.downloads) {
			return (
				<div className='download-count'>
					<p>{this.props.video.downloads}</p>
				</div>
			);
		}
	}

	showVideoViewer() {
		this.props.setVideoViewer(true, this.props.video);
	}

	hasBeenDownloaded(mediaType) {
		return Object.keys(this.props.downloaded[mediaType]).indexOf(this.props.video._id) != -1;
	}

	getRowClassName() {
		if(this.hasBeenDownloaded('audio') && this.hasBeenDownloaded('video')) {
			return 'has-downloaded has-downloaded-both';
		} else if(this.hasBeenDownloaded('audio')) {
			return 'has-downloaded has-downloaded-audio';
		} else if(this.hasBeenDownloaded('video')) {
			return 'has-downloaded has-downloaded-video';
		} else {
			return 'not-downloaded';
		}
	}

	getButtonOrProgress(mediaType) {
		let video = this.props.downloading[mediaType][this.props.video._id];
		if(!this.hasBeenDownloaded(mediaType) || video == undefined || video.progress != parseInt(video.progress, 10)) {
			return (
				<a className={'download-button-' + mediaType} onClick={() => this.download(this.props.video, mediaType)}>
					<i className='fa fa-download'></i>
				</a>
			);
		} else {
			return (
				<CircularProgressbar percentage={video.progress} className={'progress-' + mediaType} />
			);
		}
	}

	render() {
		const video = this.props.video;
		let src = 'https://img.youtube.com/vi/' + video._id + '/mqdefault.jpg';
		return (
			<li className={this.getRowClassName()}>
				<div className='left'>
					<div className='left-image' onClick={this.showVideoViewer.bind(this)}>
						<canvas ref={(c) => { this.pixelate(c, src); }} width='100' height='75'></canvas>
					</div>
					<div className='left-text'>
						<p className='title' onClick={this.showVideoViewer.bind(this)}>{video.title}</p>
						<p className='uploader'>{video.uploader}</p>
						<p className='duration'>{video.duration}</p>
						<p className='views'>{video.views}</p>
					</div>
				</div>
				<div className='download-buttons-container'>
					{this.getButtonOrProgress('audio')}
					{this.getButtonOrProgress('video')}
					{this._getDownloadCount()}
				</div>
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
