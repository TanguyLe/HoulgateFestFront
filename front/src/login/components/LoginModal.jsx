import React from "react";
import {Button, Header, Segment, TransitionablePortal} from 'semantic-ui-react'


import LogInForm from "./LogInForm"

export default class TransitionablePortalExamplePortal extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        let style = {margin: "auto", maxWidth: "calc(100% - 2em)"};

        return (
            <TransitionablePortal
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                trigger={(<Button content={'Connection'} disabled={this.state.open}/>)}
            >
                <Segment style={{width: '280px', right: '0', position: 'fixed', top: '62px', zIndex: 1000}}>
                    <Header>T'es qui toi?!</Header>
                    <LogInForm style={style} toClose={this.handleClose}/>
                </Segment>
            </TransitionablePortal>
        )
    }
}
