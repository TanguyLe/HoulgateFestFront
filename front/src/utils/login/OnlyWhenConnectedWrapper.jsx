import React from "react";
import {withRouter} from 'react-router-dom';

import {register, unregister} from "../../login/store";


class OnlyWhenConnectedWrapper extends React.Component {
    constructor(){
        super()

        this.onLogin = this.onLogin.bind(this);
    }
    componentDidMount() {
        register(this.onLogin);
    }

    componentWillUnmount() {
        unregister(this.onLogin);
    }

    onLogin() {
        this.props.history.push('/');
        if (this.props.onLogin)
            this.props.onLogin()
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(OnlyWhenConnectedWrapper);
