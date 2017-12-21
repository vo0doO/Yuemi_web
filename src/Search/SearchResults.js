import React from "react";
import io from "socket.io-client";
import _ from "lodash";
import CircularProgressbar from 'react-circular-progressbar';
import { connect } from "react-redux";
import { addDownload, removeDownload, setProgress } from "./SearchActions.js";

const mapStateToProps = (state) => {
	return {
		results: state.searchResults,
		loading: state.loading,
		downloading: state.downloading,
		progress: state.progress
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addDownload: (id) => {
			dispatch(addDownload(id))
		},
		removeDownload: (id) => {
			dispatch(removeDownload(id))
		},
		setProgress: (id, progress) => {
			dispatch(setProgress(id, progress))
		}
	};
}

class SearchResults extends React.Component {

	download(result) {
		this.props.addDownload(result.id);
		let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
		const socket = io(url);
		socket.emit('request_file', result.id);
		socket.on('progress', (data) => {
			this.props.setProgress(result.id, parseInt(data));
		})
		socket.on('request_complete', () => {
			let id = encodeURIComponent(result.id);
			let title = encodeURIComponent(result.title);
			let url = `/api/download/${id}/${title}`;
			window.location.assign(url);
			this.props.removeDownload(result.id);
		})
	}

	renderDownloadButton(result){
		if(_.hasIn(this.props.downloading, result.id)) {
			return (
				<a
					onClick={this.download.bind(this, result)}
				>
					<CircularProgressbar percentage={this.props.downloading[result.id]}/>
				</a>
			)
		} else {
			return (
				<a onClick={this.download.bind(this, result)}>
					<i className="fa fa-download"></i>
				</a>
			)
		}
	}

	pixelate(c, src) {
		if(!c) {
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

	renderResults() {
		let results = this.props.results;
		return results.map((result) => {
		let src = 'https://img.youtube.com/vi/' + result.id + '/mqdefault.jpg';
			return (
				<li key={result.id}>
					<div className="result-left">
						<div className="result-left-image">
							<canvas ref={(c) => {this.pixelate(c, src)}} width="100" height="75"></canvas>
						</div>
						<div className="result-left-text">
							<p>{result.title}</p>
							<div>
								<p className="uploader">{result.uploader}</p>
								<p className="duration">{result.duration}</p>
							</div>
							<p className="views">{result.viewCount}</p>
						</div>
					</div>
					{this.renderDownloadButton(result)}
				</li>
			)
		})
	}

	renderContent() {
		if(this.props.loading) {
			return (
				<div className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			)
		} else if(this.props.results.length > 0) {
			return (
				<ul>
					{this.renderResults()}
				</ul>
			)
		} else {
			return (
				<div className="search-results-placeholder">
				</div>
			)
		}
	}

	render() {
		return (
			<div className="search-results">
				{this.renderContent()}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
