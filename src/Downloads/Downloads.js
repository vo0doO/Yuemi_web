import React from 'react';
import { connect } from 'react-redux';
import { addDownload, removeDownload, setProgress } from './DownloadActions.js';
import DownloadRow from './DownloadRow.js';
import FlipMove from 'react-flip-move';

class Downloads extends React.Component {

	renderDownloads() {
		return (
			Object.keys(this.props.downloading).reverse().map((_id) => {
				return (
					<DownloadRow data={this.props.downloading[_id]} key={_id + 'd'} />
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
						{this.renderDownloads()}
					</FlipMove>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDownload: (_id) => {
			dispatch(addDownload(_id));
		},
		removeDownload: (_id) => {
			dispatch(removeDownload(_id));
		},
		setProgress: (_id, progress) => {
			dispatch(setProgress(_id, progress));
		}
	};
};

export { Downloads };
export default connect(mapStateToProps, mapDispatchToProps)(Downloads);
