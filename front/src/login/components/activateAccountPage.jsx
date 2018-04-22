/* @flow */
import React from "react";
import {parse} from "query-string";

import {getCallApi} from "../../utils/api/fetchMiddleware";
import {login} from "../store"


class activateAccount extends React.Component {
    constructor() {
        super();

        this.state = {
            status: "loading",
            activated: false
        }
    }

    componentWillMount(){
        // TODO Add something so that ending up on the page without id and code doesn't make it load forever
        const parsed = parse(this.props.location.search);

        this.id = parsed.id;
        this.code = parsed.code;

        if (this.id  && this.code){
            // TODO Add a bunch of constants, that url tho
            this.setState({status: "activating"});

            getCallApi(("http://localhost:3000/users/" + this.id + "/activate" + "?authorization=" + this.code), false)
                        .then((response) => {
                            if (!response.ok)
                                // TODO Generalize those errors
                                throw Error("requête");
                            return response;
                        })
                        .then((response) => response.json())
                        .then((jsonData) => {
                            this.setState({status: "loaded", activated: jsonData.activated},
                                login(jsonData.username,
                                      jsonData.accessToken,
                                      jsonData.refreshToken));
                        })
                        .catch(error => alert(error))
        }
    }

    render() {
        let display = "";
        if (this.state.status === "loading")
            display = "Activation en cours...";
        else
            display = "Ton compte est " + (this.state.activated ? "activé!"
                                                                : "désactivé. (Vérifie le lien)");

        return (
            <div>
                <h1> Activation de compte </h1>
                    {display}
            </div>
        );
    }
}

export default activateAccount;
