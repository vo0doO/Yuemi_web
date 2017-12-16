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
			window.location=(url);
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
						{this.props.progress}
				</a>
			)
		} else {
			return (
				<a onClick={this.download.bind(this, result)}>download</a>
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

	render() {
		return (
			<div>
				{this.props.loading ? "loading..." : ""}
				<ul>
					{this.renderResults()}
				</ul>
			</div>
		)
	}
}

export default SearchResults;
