import React from 'react';
import { connect } from 'react-redux';
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

	download(type) {
		this.props.addDownload(type, this.props.video._id, this.props.video);
	}

	render() {
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
								<a className='download-button-audio' onClick={this.download.bind(this, 'AUDIO')}>
									<i className='fa fa-download'></i>
								</a>
								<a className='download-button-video' onClick={this.download.bind(this, 'VIDEO')}>
									<i className='fa fa-download'></i>
								</a>
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
		video: state.videoViewerContent
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setVideoViewer: (bool, video) => {
			dispatch(setVideoViewer(bool, video));
		},
		addDownload: (type, id, video) => {
			dispatch(addDownload(type, id, video));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoViewer);
