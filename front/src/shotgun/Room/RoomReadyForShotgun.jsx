import React from "react";
import {Button} from "semantic-ui-react"

import RoomBasis from "./RoomBasis";

class RoomReadyForShotgun extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <Button onClick={this.props.createShotgunFunction}>Shotgun !</Button>
            </RoomBasis>
        );
    }
}

export default RoomReadyForShotgun;
