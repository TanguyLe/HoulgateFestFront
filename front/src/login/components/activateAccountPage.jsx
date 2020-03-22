import React from "react";
import {parse} from "query-string";

import {getCallApi} from "../../utils/api/fetchMiddleware";
import {login} from "../store"
import {getActivateUserUrl} from "../constants"


class activateAccount extends React.Component {
    constructor() {
        super();

        this.state = {
            status: "loading",
            activated: false
        }
    }

    componentDidMount(){
        const parsed = parse(this.props.location.search);

        this.id = parsed.id;
        this.code = parsed.code;

        if (this.id  && this.code){
            this.activateUrl = getActivateUserUrl(this.id, this.code);
            this.setState({status: "activating"});

            getCallApi(this.activateUrl, false)
                        .then((response) => {
                            if (!response.ok)
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
        else
            this.setState({status: "failed"})
    }

    render() {
        let display = "";
        if (this.state.status === "loading")
            display = "Activation en cours...";
        else
            display = "Ton compte est " + (this.state.activated ? "activé!"
                                                                : "désactivé. (Il y a une erreur, vérifie le lien)");

        return (
            <div className="activateAccountPage">
                <h1> Activation de compte </h1>
                    {display}
            </div>
        );
    }
}

export default activateAccount;
