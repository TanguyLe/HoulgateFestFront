/* @flow */
import React from "react";
import glamorous from "glamorous";

import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import WhoAmI from "./WhoAmI";
import ReadUser from "./ReadUser"
import Card from "../../utils/Card/index";
import {STYLED_TAB_INDEX_PREFIX, TAB_LABELS} from "../constants";

const StyledTab = glamorous.div(
    {
        display: "inline-block",
        border: "1px solid transparent",
        borderBottom: "none",
        bottom: "0px",
        position: "relative",
        listStyle: "none",
        padding: "6px 12px",
        cursor: "pointer",
        background: "#fff",
        borderColor: "#aaa",
        color: "black",
        borderRadius: "5px 5px 0 0",
        ":focus": {
            boxShadow: "0 0 5px hsl(208, 99%, 50%)",
            borderColor: "hsl(208, 99%, 50%)",
            outline: "none"
        },
        ":focus::after": {
            content: " ",
            position: "absolute",
            height: "5px",
            left: "-4px",
            right: "-4px",
            bottom: "-5px",
            background: "#fff"
        }
    },
    ({selected}) => {
        if (selected === true) {
            return {
                bottom: "-1px"
            };
        }
    },
    ({disabled}) => {
        if (disabled === true) {
            return {
                color: "GrayText",
                cursor: "default"
            };
        }
    }
);


class UserLogin extends React.Component {
    constructor() {
        super();
        this.state = {tabIndex: 0};

        this.onTabChange = this.onTabChange.bind(this)
    }

    onTabChange(index) {
        this.setState({tabIndex: index})
    }

    render() {
        let style = {margin: "auto", maxWidth: "calc(100% - 2em)"};

        const ContentToDisplay =
            this.state.tabIndex === 1
                ? <LogInForm style={style}/>
                : this.state.tabIndex === 2
                    ? <SignUpForm style={style}/>
                    :  <ReadUser style={style}/>;

        return (

            <Card>
                <Card.title
                    style={{
                        fontSize: "1.2em",
                        padding: "0",
                        alignItems: "normal",
                        height: 36
                    }}
                >
                    {TAB_LABELS.map((label, index) => {
                        return(
                        <StyledTab key={index + STYLED_TAB_INDEX_PREFIX}
                                   selected={this.state.tabIndex === index}
                                   onClick={() => this.onTabChange(index)}>
                            {label}
                        </StyledTab>);
                    })}
                </Card.title>
                <Card.content
                    style={{
                        padding: 0,
                        borderTop: "1px solid rgba(0, 0, 0, 0.3)",
                        borderLeft: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRight: "1px solid rgba(0, 0, 0, 0.3)",
                        //borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
                        borderRadius: " 0 0 5px 5px"
                    }}
                >
                    {ContentToDisplay}
                </Card.content>
            </Card>
        );
    }
}

export default UserLogin;
