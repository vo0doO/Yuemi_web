import React from "react";
import fs from "file-saver";
import io from "socket.io-client";

class SearchResults extends React.Component {

	download(result) {
		const socket = io('http://localhost:8081/');
		socket.on('progress', (data) => {
			this.props.setProgress(parseInt(data));
		})
		this.props.setDownloading(result.id);
		fetch('/api/request_file/' + result.id)
			.then((res) => {
				return res.text();
			})
			.then((text) => {
				console.log(text);
				fetch('/api/download/' + result.id)
					.then((res) => res.blob())
					.then((blob) => {
						fs.saveAs(blob, result.title + '.mp3');
						this.props.setDownloading(null);
						this.props.setProgress(0);
					})
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
