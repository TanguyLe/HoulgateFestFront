/* @flow */
import React from "react";
import {Input, Button, Form, Grid} from "semantic-ui-react"

import {READ_USER_URL} from "../constants";
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
                <div>
                    <h1> GetUserNameTest </h1>
                    <Form>
                        userId:
                        <Input
                            type="text"
                            value={this.state.userId}
                            name="userId"
                            onChange={this.handleChange}
                            placeholder='MongoUserId...'/>
                        <Button onClick={this.onClickSearch}>
                            Search
                        </Button>
                    </Form>
                    Found Username: {this.state.username}
                </div>
            );
    }
}

export default UserReader;
