import React from "react";
import glamorous from "glamorous";

import Button from "../../utils/basics/Button";

class Room extends React.Component {
	constructor() {
		super();

		this.state = {
		    status: "shotgun",
        };

        this.onClickShotgun = this.onClickShotgun.bind(this);
	}
	onClickShotgun() {
	    this.setState({status: "preShotgun"})
    }
	render() {
	    let preShotgunComp = "Je suis une fenêtre!";
	    let shotgunComp = this.props.seats ? <Button onClick={this.onClickShotgun}>Shotgun !</Button> : "";
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					border: "1px solid #353535", //TODO choose color (don't change this syntaxe, it's used in my pluggin)
					gridColumnStart: this.props.position.columnStart,
					gridColumnEnd: this.props.position.columnEnd,
					gridRowStart: this.props.position.rowStart,
					gridRowEnd: this.props.position.rowEnd
				}}
			>
				{this.props.name}
				{this.state.status === "shotgun" ? shotgunComp : preShotgunComp}
			</div>
		);
	}
}

export default Room;
