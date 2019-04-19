import React from "react";
import {Popup} from 'semantic-ui-react'

class RoomBasis extends React.Component {
    constructor() {
        super();

        this.getUsername = this.getUsername.bind(this);
    }

    getUsername(userId) {
        return this.props.userInfo[userId].username;
    }

    render() {
        console.log(this.props);
        let preDisplay = this.props.seats ? (this.props.seats + " places") : null;
        let user = this.props.user ? ("par " + this.getUsername(this.props.user)) : '';
        user = <div>{user}</div>;

        let roommates = this.props.roommates ? this.props.roommates.map((userId) => this.getUsername(userId)).join(', ')
            : null;

        let view = '';
        if (roommates)
            view = <Popup trigger={user} content={"Avec: " + roommates}/>;
        else
            view = user;

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #353535",
                    gridColumnStart: this.props.position.columnStart,
                    gridColumnEnd: this.props.position.columnEnd,
                    gridRowStart: this.props.position.rowStart,
                    gridRowEnd: this.props.position.rowEnd
                }}
            >
                {this.props.name}
                <br/>{preDisplay}<br/>
                {view}
                {this.props.children}
            </div>
        );
    }
}

export default RoomBasis;
