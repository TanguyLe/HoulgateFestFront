import React from "react";
import glamorous from "glamorous";
import { isNil } from "lodash/fp";

import RoomBasis from "./RoomBasis";
import ShotgunPortal from "./ShotgunModal";

class Room extends React.Component {
    getRoomContent() {
        switch (this.props.shotgunState) {
            case "disabled":
                return <div>DISABLED</div>;
            case "readyForShotgun":
                return (
                    <ShotgunPortal
                        seats={this.props.seats}
                        name={this.props.name}
                        status={"readyForShotgun"}
                        availablePersonIds={this.props.availablePersonIds}
                        createShotgunFunction={this.props.createShotgunFunction}
                    />
                );
            case "loading":
                return (
                    <ShotgunPortal
                        seats={this.props.seats}
                        name={this.props.name}
                        status={"loading"}
                        availablePersonIds={this.props.availablePersonIds}
                        createShotgunFunction={this.props.createShotgunFunction}
                    />
                );
            case "attributingBeds":
                return (
                    <ShotgunPortal
                        seats={this.props.seats}
                        name={this.props.name}
                        status={"attributingBeds"}
                        availablePersonIds={this.props.availablePersonIds}
                        onSubmit={this.props.onSubmit}
                        addPersonsInShotgunFunction={roommatesIds =>
                            this.props.addPersonsInShotgunFunction(this.props.name, roommatesIds)
                        }
                    />
                );
        }
    }

    render() {
        return (
            <RoomBasis {...this.props} seats={this.props.seats} position={this.props.position} name={this.props.name}>
                <ShotgunPortal
                    seats={this.props.seats}
                    name={this.props.name}
                    status={this.props.shotgunState}
                    availablePersonIds={this.props.availablePersonIds}
                    createShotgunFunction={this.props.createShotgunFunction}
                    addPersonsInShotgunFunction={roommatesIds =>
                        this.props.addPersonsInShotgunFunction(this.props.name, roommatesIds)
                    }
                />
                {/*this.getRoomContent()*/}
            </RoomBasis>
        );
    }
}

export default Room;
