import React from "react";
import RoomBasis from "./RoomBasis";

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
