import React from 'react';

class TooltipText extends React.Component {

	render() {
		let visibility = this.props.visible ? 'visible' : 'hidden';
		return (
			<span className='tooltiptext' style={{visibility}}>{this.props.text}</span>
		);
	}
}

export default TooltipText;
