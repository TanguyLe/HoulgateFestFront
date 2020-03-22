import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

import Home from "./mainLayout/home"

import ShotgunPage from "./shotgun/shotgunPage"
import NotFound from "./mainLayout/notFound"
import SignUpPage from "./login/components/signUpPage"
import ActivateAccount from "./login/components/activateAccountPage"
import PasswordResetPage from "./login/components/passwordResetPage"
import CreatePasswordResetPage from "./login/components/createPasswordResetPage"
import DefaultLayout from './mainLayout/layout'
import ContactPage from './contact/contactPage'


class App extends React.Component {
    render() {
        return <Router>
                <Switch>
                    <Route exact path="/">
                        <DefaultLayout exact component={Home}/>
                    </Route>
                    <Route path="/shotgun">
                        <DefaultLayout component={ShotgunPage} bigContainer/>
                    </Route>
                    <Route path="/contact">
                        <DefaultLayout component={ContactPage}/>
                    </Route>
                    <Route path="/register">
                        <DefaultLayout component={SignUpPage}/>
                    </Route>
                    <Route path="/activateUser">
                        <DefaultLayout component={ActivateAccount}/>
                    </Route>
                    <Route path="/passwordReset">
                        <DefaultLayout component={PasswordResetPage}/>
                    </Route>
                    <Route path="/createPasswordReset">
                        <DefaultLayout component={CreatePasswordResetPage}/>
                    </Route>
                    <Route path="*">
                        <DefaultLayout component={NotFound}/>
                    </Route>
                </Switch>
        </Router>;
    }
}

export default App;