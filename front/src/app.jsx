import React from "react"
import {BrowserRouter, Route, Switch} from "react-router-dom"

import Home from "./mainLayout/home"

import ShotgunPage from "./shotgun/shotgunPage"
import NotFound from "./mainLayout/notFound"
import SignUpPage from "./login/components/signUpPage"
import activateAccount from "./login/components/activateAccountPage"
import passwordResetPage from "./login/components/passwordResetPage"
import createPasswordResetPage from "./login/components/createPasswordResetPage"
import DefaultLayout from './mainLayout/layout'
import ContactPage from './contact/contactPage'


class App extends React.Component {
    render() {
        return <BrowserRouter>
                <Switch>
                    <Route path="/">
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
                        <DefaultLayout component={activateAccount}/>
                    </Route>
                    <Route path="/passwordReset">
                        <DefaultLayout component={passwordResetPage}/>
                    </Route>
                    <Route path="/createPasswordReset">
                        <DefaultLayout component={createPasswordResetPage}/>
                    </Route>
                    <Route path="*">
                        <DefaultLayout component={NotFound}/>
                    </Route>
                </Switch>
        </BrowserRouter>
    }
}

export default App;