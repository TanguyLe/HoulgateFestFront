import React from "react";
import glamorous from "glamorous";

import Button from "../../utils/basics/Button";
import {ROOM_SEATS_DISPLAY_INDEX_PREFIX} from "../constants"

class Room extends React.Component {
    constructor() {
        super();

        this.state = {
            status: "shotgun",
            persons: []
        };

        this.onClickShotgun = this.onClickShotgun.bind(this);
    }

    onClickShotgun() {
        this.setState({status: "preShotgun", persons: ["Jean", "Mi", "Chelle"]})
    }

    render() {
        let display = "";
        let preDisplay = [];

        if (this.props.seats) {
            preDisplay = [<br/>, this.props.seats + " places", <br/>];

            if (this.state.status === "shotgun")
                display = <Button onClick={this.onClickShotgun}>Shotgun !</Button>;
            else
                display = "Habitants: " + this.state.persons.join(", ");
        }

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
                {preDisplay.map((e, i) => {
                    return <div key={ROOM_SEATS_DISPLAY_INDEX_PREFIX + this.props.name + i}>{e}</div>
                })}
                {display}
            </div>
        );
    }
}

export default Room;
