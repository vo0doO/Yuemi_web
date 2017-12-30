import React from 'react';
import { addDownload } from '../Downloads/DownloadActions.js';
import { connect } from 'react-redux';

class Row extends React.Component {

	download(result) {
		this.props.addDownload(result.id, result);
	}

	pixelate(c, src) {
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

	render() {
		const result = this.props.data;
		let src = 'https://img.youtube.com/vi/' + result.id + '/mqdefault.jpg';
		return (
			<li>
				<div className='left'>
					<div className='left-image'>
						<canvas ref={(c) => { this.pixelate(c, src); }} width='100' height='75'></canvas>
					</div>
					<div className='left-text'>
						<p>{result.title}</p>
						<div>
							<p className='uploader'>{result.uploader}</p>
							<p className='duration'>{result.duration}</p>
						</div>
						<p className='views'>{result.views}</p>
					</div>
				</div>
				<a onClick={() => this.download(result)}>
					<i className='fa fa-download'></i>
				</a>
			</li>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading,
		downloaded: state.downloaded,
		progress: state.progress
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addDownload: (id, bundle) => {
			dispatch(addDownload(id, bundle));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Row);
