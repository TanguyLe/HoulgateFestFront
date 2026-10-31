import React from "react";
import withRouter from "../utils/withRouter";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { login } from "./store";
import { getActivateUserUrl } from "./constants";
import { Notice, PageHeader } from "../ui";

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
            display = <Notice loading>Activation en cours...</Notice>;
        else if (this.state.activated)
            display = <Notice kind="success">Ton compte est activé!</Notice>;
        else
            display = (
                <Notice kind="error">
                    Ton compte est désactivé. (Il y a une erreur, vérifie le lien)
                </Notice>
            );

        return (
            <div className="activateAccountPage auth-page">
                <PageHeader kicker="Mon compte" title="Activation de compte" />
                <div className="card card--striped">{display}</div>
            </div>
        );
    }
}

export default withRouter(ActivateAccount);
