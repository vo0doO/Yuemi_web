import React from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import { setVideoViewer } from './VideoViewerActions.js';
import { addDownload } from '../Downloads/DownloadActions.js';

class VideoViewer extends React.Component {

	getClasses(classList) { // a little verbose
		if(this.props.showing) {
			classList.push('showing');
		}
		return classList.join(' ');
	}

	close() {
		this.props.setVideoViewer(false, {});
	}

	download(mediaType) {
		this.props.addDownload(mediaType, this.props.video._id, this.props.video);
	}

	inDownloading(video, mediaType) {
		return Object.keys(this.props.downloading[mediaType]).indexOf(video._id) != -1;
	}

	getButtonOrProgressBar(video, mediaType) {
		if(this.inDownloading(video, mediaType)) {
			return (
				<CircularProgressbar percentage={this.props.downloading[mediaType][video._id].progress} className={'progress-' + mediaType} />

			);
		} else {
			return (
				<a
					className={'download-button-' + mediaType.toLowerCase()}
					onClick={this.download.bind(this, mediaType)}
				>
					<i className='fa fa-download'></i>
				</a>
			);
		}
	}

	render() {
		if(this.props.video._id == undefined) {
			return <div></div>;
		}
		let src = 'https://img.youtube.com/vi/' + this.props.video._id + '/hqdefault.jpg';
		return (
			<div className={this.getClasses(['video-viewer'])}>
				<div className={this.getClasses(['video-viewer-content'])}>
					<div className='video-viewer-content-top' style={{'backgroundImage': `url(${src})`}}>
						<div className='video-viewer-text-container'>
							<h1 className='video-viewer-text'>{this.props.video.title}</h1>
							<h3 className='video-viewer-text'>{this.props.video.uploader}</h3>
							<h3 className='video-viewer-text'>{this.props.video.views}</h3>
							<h3 className='video-viewer-text'>{this.props.video.duration}</h3>
							<div className='download-buttons-container'>
								{this.getButtonOrProgressBar(this.props.video, 'audio')}
								{this.getButtonOrProgressBar(this.props.video, 'video')}
							</div>
						</div>
					</div>
					<div className='close-viewer' onClick={this.close.bind(this)}>
						<i className="fa fa-times"></i>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		showing: state.videoViewerShowing,
		video: state.videoViewerContent,
		downloading: state.downloading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setVideoViewer: (bool, video) => {
			dispatch(setVideoViewer(bool, video));
		},
		addDownload: (mediaType, id, video) => {
			dispatch(addDownload(mediaType, id, video));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoViewer);
