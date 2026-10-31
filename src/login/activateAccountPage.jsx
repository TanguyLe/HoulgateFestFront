import React from "react";
import withRouter from "../utils/withRouter";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { login } from "./store";
import { getActivateUserUrl } from "./constants";
import AuthCard from "./components/authCard";
import { Callout, Loading } from "../ui";

class ActivateAccount extends React.Component {
    constructor() {
        super();

        this.state = {
            status: "loading",
            activated: false,
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);

        this.id = params.get("id");
        this.code = params.get("code");

        if (this.id && this.code) {
            this.activateUrl = getActivateUserUrl(this.id, this.code);
            this.setState({ status: "activating" });

            getCallApi(this.activateUrl, false)
                .then((response) => {
                    if (!response.ok) throw Error("requête");
                    return response;
                })
                .then((response) => response.json())
                .then((jsonData) => {
                    this.setState(
                        { status: "loaded", activated: jsonData.activated },
                        login(jsonData.username, jsonData.accessToken, jsonData.refreshToken),
                    );
                })
                .catch((error) => alert(error));
        } else this.setState({ status: "failed" });
    }

    render() {
        let display;
        if (this.state.status === "loading" || this.state.status === "activating")
            display = <Loading emoji="🔑">Activation en cours...</Loading>;
        else if (this.state.activated)
            display = (
                <Callout kind="success" icon="🥳">
                    Ton compte est activé!
                </Callout>
            );
        else
            display = (
                <Callout kind="error">
                    Ton compte est désactivé. (Il y a une erreur, vérifie le lien)
                </Callout>
            );

        return (
            <AuthCard emoji="🔑" title="Activation de compte">
                {display}
            </AuthCard>
        );
    }
}

export default withRouter(ActivateAccount);
