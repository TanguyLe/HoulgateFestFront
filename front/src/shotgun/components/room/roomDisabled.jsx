import React from "react";
import RoomBasis from "./roomBasis";

class RoomDisabled extends React.Component {
    render() {
        return (
            <RoomBasis {...this.props}>
                <div>DISABLED</div>
            </RoomBasis>
        );
    }
}

export default RoomDisabled;
