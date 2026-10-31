import React from "react";
import withRouter from "../utils/withRouter";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { login } from "./store";
import { getActivateUserUrl } from "./constants";
import AccountCard from "./components/accountCard";
import { Loading, Notice } from "../ui";

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
                .catch(() => this.setState({ status: "loaded", activated: false }));
        } else this.setState({ status: "failed" });
    }

    render() {
        let display;
        if (this.state.status === "loading" || this.state.status === "activating")
            display = <Loading>Activation en cours…</Loading>;
        else if (this.state.activated)
            display = (
                <Notice tone="success" title="Ton compte est activé !">
                    Tu es connecté, à toi le shotgun.
                </Notice>
            );
        else
            display = (
                <Notice tone="error" title="Ton compte n'a pas pu être activé">
                    Il y a une erreur, vérifie le lien reçu par mail.
                </Notice>
            );

        return <AccountCard title="Activation du compte">{display}</AccountCard>;
    }
}

export default withRouter(ActivateAccount);
