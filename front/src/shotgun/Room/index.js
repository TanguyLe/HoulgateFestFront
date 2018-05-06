import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

import RoomReadyForShotgun from "./RoomReadyForShotgun";
import RoomLoading from "./RoomLoading";
import RoomDisabled from "./RoomDisabled";
import RoomAttributingBeds from "./RoomAttributingBeds";

class Room extends React.Component {
    render() {
        switch (this.props.shotgunState) {
            case "disabled":
                return <RoomDisabled seats={this.props.seats} position={this.props.position} name={this.props.name} />;
            case "readyForShotgun":
                return (
                    <RoomReadyForShotgun
                        seats={this.props.seats}
                        position={this.props.position}
                        name={this.props.name}
                        createShotgunFunction={this.props.createShotgunFunction}
                    />
                );
            case "loading":
                return <RoomLoading seats={this.props.seats} position={this.props.position} name={this.props.name} />;
            case "attributingBeds":
                return (
                    <RoomAttributingBeds
                        seats={this.props.seats}
                        position={this.props.position}
                        name={this.props.name}
                        availablePersonIds={this.props.availablePersonIds}
                        addPersonsInShotgunFunction={roommatesIds =>
                            this.props.addPersonsInShotgunFunction(this.props.name, roommatesIds)
                        }
                    />
                );

            default:
                return (
                    <RoomReadyForShotgun
                        seats={this.props.seats}
                        position={this.props.position}
                        name={this.props.name}
                    />
                );
        }
    }
}

export default Room;
