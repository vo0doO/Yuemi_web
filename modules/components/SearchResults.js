import React from "react";
import io from "socket.io-client";

class SearchResults extends React.Component {

	download(result) {
		this.props.setDownloading(result.id);
		const socket = io('http://localhost:8081/');
		socket.emit('request_file', result.id);
		socket.on('progress', (data) => {
			this.props.setProgress(parseInt(data));
		})
		socket.on('request_complete', () => {
			let id = encodeURIComponent(result.id);
			let title = encodeURIComponent(result.title);
			let url = `http://localhost:8080/api/download/${id}/${title}`;
			window.location.assign(url);
			this.props.setDownloading(null);
			this.props.setProgress(0);
		})
	}

	renderDownloadButton(result){
		if(result.id == this.props.downloading) {
			return (
				<a
					onClick={this.download.bind(this, result)}
				>
					<progress value={this.props.progress} max={100}></progress>
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

	renderResults() {
		let results = this.props.results;
		return results.map((result) => {
			return (
				<li key={result.id}>
					<p>{result.title}</p>
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
		} else {
			return (
				<ul>
					{this.renderResults()}
				</ul>
			)
		}
	}

	render() {
		return (
			<div className="searchResults">
				{this.renderContent()}
			</div>
		)
	}
}

export default SearchResults;
