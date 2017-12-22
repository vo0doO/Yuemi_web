import React from "react";
import { connect } from "react-redux";
import CircularProgressbar from 'react-circular-progressbar';
import io from "socket.io-client";
import { setActive, removeDownload, setProgress } from "./DownloadActions.js";

class DownloadRow extends React.Component {

    componentDidMount() {
        const data = this.props.data;
        let url = process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8081';
        const socket = io(url);
        if (!data.active) {
            socket.emit('request_file', data.id);
            this.props.setActive(data.id);
            this.addDownloadToFeed(data);
        }
        // no error handling yet
        socket.on('progress', (progress_string) => {
            this.props.setProgress(data.id, parseInt(progress_string));
        })
        socket.on('request_complete', () => {
            let id = encodeURIComponent(data.id);
            let title = encodeURIComponent(data.title);
            let url = `/api/download/${id}/${title}`;
            window.location.assign(url);
            this.props.removeDownload(data.id);
        })
    }

    addDownloadToFeed(data) {
        let { id, title, duration, uploader, views } = data;
        fetch('/api/downloads', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                title,
                duration,
                uploader,
                views
            })
        })
            .then((res) => {
                // error handling
            });
    }

    render() {
        return (
            <li>
                <p>
                    {this.props.data.title}
                </p>
                <a>
                    <CircularProgressbar percentage={this.props.data.progress} />
                </a>
            </li>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        downloads: state.downloads,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActive: (id) => {
            dispatch(setActive(id))
        },
        removeDownload: (id) => {
            dispatch(removeDownload(id))
        },
        setProgress: (id, progress) => {
            dispatch(setProgress(id, progress))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadRow);