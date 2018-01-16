import React from 'react';
import { connect } from 'react-redux';
import VideoListRow from './VideoListRow.js';

class VideoList extends React.Component {

	getDownloadingLength() {
		let audioList = Object.keys(this.props.downloading.audio);
		let videoList = Object.keys(this.props.downloading.video);
		return audioList.concat(videoList).length;
	}

	shouldComponentUpdate(nextProps) {
		if(nextProps.videoList != this.props.videoList) {
			return true;
		} else {
			let nextPropsAudioList = Object.keys(nextProps.downloading.audio);
			let nextPropsVideoList = Object.keys(nextProps.downloading.video);
			let nextPropsDownloadLength = nextPropsAudioList.concat(nextPropsVideoList).length;
			return nextPropsDownloadLength == this.getDownloadingLength();
		}
	}

	renderVideoList() {
		return this.props.videoList.map((video) => {
			return (
				<VideoListRow video={video} key={video._id} />
			);
		});
	}

	renderContent() {
		let dlen = this.getDownloadingLength();
		if (this.props.loading) {
			return (
				<div className='spinner'>
					<div className='bounce1'></div>
					<div className='bounce2'></div>
					<div className='bounce3'></div>
				</div>
			);
		} else if (this.props.videoList.length > 0) {
			return (
				<ul style={{ 'marginBottom': dlen * 50 }}>
					{this.renderVideoList()}
				</ul>
			);
		}
	}

	render() {
		return (
			<div className='video-list'>
				{this.renderContent()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.loading,
		downloading: state.downloading
	};
};

export default connect(mapStateToProps)(VideoList);
