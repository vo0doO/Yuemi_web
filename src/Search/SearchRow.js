import React from "react";

class SearchRow extends React.Component {

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
        const result = this.props.result;
        let src = 'https://img.youtube.com/vi/' + result.id + '/mqdefault.jpg';
        return (
            <li className="search-result">
                <div className="result-left">
                    <div className="result-left-image">
                        <canvas ref={(c) => { this.pixelate(c, src) }} width="100" height="75"></canvas>
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
                <a onClick={() => this.props.download(result)}>
                    <i className="fa fa-download"></i>
                </a>
            </li>
        )
    }
}

export default SearchRow;