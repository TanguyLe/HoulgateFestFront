import React from "react";
import {Popup} from 'semantic-ui-react'
import glamorous from "glamorous"

// Cannot set hover in inline style
// I use glamorous to do it
// @emotion/styled would be better
// but I am too lazy

const StyledDiv = glamorous.div(({ position, borderColor = "#353535", hover = false})=>{
    const hoverProps = !hover ? {} : {
        ":hover": {"& .tooltip": {visibility: "visible"}}
    }
    return ({
    position:"relative",
    border: `1px solid ${borderColor}`,
    userSelect:"none",
    gridColumnStart: position.columnStart,
    gridColumnEnd: position.columnEnd,
    gridRowStart: position.rowStart,
    gridRowEnd: position.rowEnd,
    ...hoverProps
})})

const Tooltip = glamorous.div({
    visibility: "hidden",
    minWidth:"100%",
    backgroundColor: "rgba(35,35,35,0.7)",
    color: "#fff",
    textAlign: "center",
    borderRadius: 6,
    padding: '5px 0px',
    position: "absolute",
    top: -5,
    zIndex: 1,
    transform: "translateY(-100%)"
})

const Wrapper = glamorous.div({  
    display: "flex",
    height:"100%",
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
})


class RoomBasis extends React.Component {
    constructor() {
        super();

        this.getUsername = this.getUsername.bind(this);
    }

    getUsername(userId) {
        return this.props.userInfo[userId].username;
    }

    render() {
        const { seats, user, roommates, children, name, position, small = false, borderColor } = this.props
        let preDisplay = seats ? ("\n"+ seats + " places") : null;
        let userName = user ? ("par " + this.getUsername(user)) : '';
        userName = <div>{user}</div>;

        let roommatesDisplay = roommates ? roommates.map((userId) => this.getUsername(userId)).join(', ')
            : null;

        let view = '';
        if (roommatesDisplay)
            view = <Popup trigger={userName} content={"Avec: " + roommatesDisplay}/>;
        else
            view = userName;
           
        return (
            <StyledDiv hover position={position} borderColor={borderColor}>
                <Tooltip className={"tooltip"}> 
                    {name}
                    {preDisplay}
                </Tooltip>
                <Wrapper>
                    {children}
                    <span style={{overflowWrap:" break-word",width:"100%"}}>{name}</span>
                    {preDisplay}
                    {view}
                </Wrapper>
            </StyledDiv>
        );
        
    }
}

export default RoomBasis;
