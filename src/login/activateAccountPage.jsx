import React from "react";
import withRouter from "../utils/withRouter";

import { getCallApi } from "../utils/api/fetchMiddleware";
import { login } from "./store";
import { getActivateUserUrl } from "./constants";
import { Alert, PageHeader } from "../ui/components";
import { notify } from "../ui/toast";

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
                    if (jsonData.activated) notify.success("Compte activé, bienvenue !");
                    this.setState(
                        { status: "loaded", activated: jsonData.activated },
                        login(jsonData.username, jsonData.accessToken, jsonData.refreshToken),
                    );
                })
                .catch((error) => {
                    this.setState({ status: "loaded", activated: false });
                    notify.error(error);
                });
        } else this.setState({ status: "failed" });
    }

    render() {
        const { status, activated } = this.state;
        let display;

        if (status === "loading" || status === "activating")
            display = (
                <Alert loading title="Activation en cours…">
                    On vérifie ton lien, ça ne prend qu’une seconde.
                </Alert>
            );
        else if (activated)
            display = (
                <Alert tone="success" title="Ton compte est activé !">
                    Tu es connecté, direction le shotgun.
                </Alert>
            );
        else
            display = (
                <Alert tone="error" title="Ton compte n’a pas pu être activé">
                    Il y a une erreur, vérifie le lien reçu par mail.
                </Alert>
            );

        return (
            <div className="activateAccountPage">
                <PageHeader title="Activation du compte" />
                {display}
            </div>
        );
    }
}

export default withRouter(ActivateAccount);
