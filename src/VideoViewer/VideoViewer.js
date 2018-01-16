import React from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import { setVideoViewer } from './VideoViewerActions.js';
import { addDownload } from '../Downloads/DownloadActions.js';
import { Transition } from 'react-transition-group';

class VideoViewer extends React.Component {

	close() {
		this.props.setVideoViewer(false, this.props.video);
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
		let transitionStyles_container = {
			entering: { visibility: 'visible', opacity: 1 },
			entered: { visibility: 'visible', opacity: 1 },
			exiting: { visibility: 'hidden', opacity: 0 },
			exited: { visibility: 'hidden', opacity: 0 }
		};
		let transitionStyles_content = {
			entering: { transform: 'rotateX(0deg)' },
			entered: { transform: 'rotateX(0deg)' },
			exiting: { transform: 'rotateX(-90deg)' },
			exited: { transform: 'rotateX(-90deg)' }
		};
		let shouldShow = this.props.video._id != undefined && this.props.showing;
		let thumbnail_src = shouldShow ? 'https://img.youtube.com/vi/' + this.props.video._id + '/hqdefault.jpg' : '#';
		let video_src = 'https://www.youtube.com/watch?v=' + this.props.video._id;
		return (
			<Transition
				in={shouldShow}
				timeout={{enter: 0, exit: 300}}
			>
				{(state) => (
					<div className='video-viewer' style={{...transitionStyles_container[state]}}>
						<div className='video-viewer-content' style={{...transitionStyles_content[state]}}>
							<div className='video-viewer-content-top' style={{'backgroundImage': `url(${thumbnail_src})`}}>
								<div className='video-viewer-overlay'>
									<div className='video-viewer-text-container'>
										<h1 className='video-viewer-text'>{this.props.video.title}</h1>
										<a className='video-viewer-text' href={video_src}>{this.props.video._id}</a>
										<h3 className='video-viewer-text'>{this.props.video.uploader}</h3>
										<h3 className='video-viewer-text'>{this.props.video.views}</h3>
										<h3 className='video-viewer-text'>{this.props.video.duration}</h3>
										<div className='download-buttons-container'>
											{this.getButtonOrProgressBar(this.props.video, 'audio')}
											{this.getButtonOrProgressBar(this.props.video, 'video')}
										</div>
									</div>
								</div>
							</div>
							<div className='close-viewer' onClick={this.close.bind(this)}>
								<i className="fa fa-times"></i>
							</div>
						</div>
					</div>
				)}
			</Transition>
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
