/* @flow */
import React from "react";

import Block from "../../utils/basics/Block/index";
import Text from "../../utils/basics/Text/index";
import Wrapper from "../../utils/basics/Wrapper/index";
import {READ_USER_URL} from "../constants";
import Button from "../../utils/basics/Button/index";
import {getCallApi} from "../../utils/api/fetchMiddleware";


class UserReader extends React.Component {
    constructor() {
        super();

        this.state = {userId: "", username: ""};
        this.handleChange = this.handleChange.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onClickSearch() {
        if (this.state.userId)
            getCallApi((READ_USER_URL + '/' + this.state.userId))
                .then((response) => {
                    if (!response.ok)
                        throw Error("requête");
                    return response;
                })
                .then((response) => response.json())
                .then((jsonData) => {

                    this.setState({username: (jsonData.username || "Not Found")});
                })
                .catch(error => alert(error))
    }

    render() {
            return (
                <Wrapper column>
                    <Block>
                        <Text weight="bold">userId: </Text>
                        <input
                            type={"text"} value={this.state.userId}
                            name={"userId"}
                            onChange={this.handleChange}/>
                        <Button onClick={this.onClickSearch}>
                            Search
                        </Button>
                        <Block padding="small" align="left">
                            <Text>Found Username: </Text>
                            <Text>{this.state.username} </Text>
                        </Block>
                    </Block>
                </Wrapper>
            );
    }
}

export default UserReader;
