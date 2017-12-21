import React from "react";
import { connect } from "react-redux";
import { addDownload, removeDownload, setProgress } from "./DownloadActions.js";
import DownloadRow from "./DownloadRow.js";

const mapStateToProps = (state) => {
    return {
        results: state.searchResults,
        loading: state.loading,
        downloading: state.downloading
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

class Downloads extends React.Component {


    renderDownloads() {
        return (
            Object.keys(this.props.downloading).map((id) => {
                return (
                    <DownloadRow data={this.props.downloading[id]} key={id + 'd'} />
                )
            })
        )
    }

    render() {
        return (
            <div id="downloads">
                <ul>
                    {this.renderDownloads()}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Downloads);