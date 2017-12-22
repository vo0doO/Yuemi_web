import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { updateFeed } from "./FeedActions";
import Row from "../Row/Row.js";

class Feed extends React.Component {

    componentDidMount() {
        fetch('/api/downloads')
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.props.updateFeed(json);
            })
    }

    renderFeed() {
        return this.props.feed.map((data) => {
            return <Row data={Object.assign({}, data, { id: data._id })} key={data._id} />
        })
    }

    render() {
        let dlen = Object.keys(this.props.downloading).length;
        return (
            <div className="feed">
                <h1>
                    Recently Downloaded
                </h1>
                <ul style={{ "marginBottom": dlen * 50 }}>
                    {this.renderFeed()}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        feed: state.feed,
        downloading: state.downloading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFeed: (feed) => {
            dispatch(updateFeed(feed))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);