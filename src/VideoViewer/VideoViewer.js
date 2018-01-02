import React from 'react';
import { connect } from 'react-redux';
import { setVideoViewer } from './VideoViewerActions.js';

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

	render() {
		return (
			<div className={this.getClasses(['video-viewer'])}>
				<div className={this.getClasses(['video-viewer-content'])}>
					<h1>{this.props.video.title}</h1>
					<h1>{this.props.video.uploader}</h1>
					<h1>{this.props.video.views}</h1>
					<h1>{this.props.video.duration}</h1>
					<i className="fa fa-times" onClick={this.close.bind(this)}></i>
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoViewer);
