import React from 'react';
import { connect } from 'react-redux';
import DownloadRow from './DownloadRow.js';
import FlipMove from 'react-flip-move';

class Downloads extends React.Component {

	renderDownloads(mediaType) {
		return (
			Object.keys(this.props.downloading[mediaType]).reverse().map((_id) => {
				return (
					<DownloadRow data={this.props.downloading[mediaType][_id]} mediaType={mediaType} key={_id + 'd'} />
				);
			})
		);
	}

	render() {
		return (
			<div id='downloads'>
				<ul>
					<FlipMove
						duration={500}
						easing='ease-out'
						appearAnimation='fade'
						enterAnimation='fade'
						leaveAnimation='fade'
					>
						{this.renderDownloads('audio')}
						{this.renderDownloads('video')}
					</FlipMove>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		downloading: state.downloading
	};
};

export { Downloads };
export default connect(mapStateToProps)(Downloads);
