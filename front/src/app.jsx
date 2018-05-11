import React from "react"
import {BrowserRouter, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Dummy from "./shotgun/components/dummy"
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
                    <DefaultLayout path="/" exact component={Home}/>
                    <DefaultLayout path="/shotgun" component={Dummy} bigContainer/>
                    <DefaultLayout path="/contact" component={ContactPage}/>
                    <DefaultLayout path="/register" component={SignUpPage}/>
                    <DefaultLayout path="/activateUser" component={activateAccount}/>
                    <DefaultLayout path="/passwordReset" component={passwordResetPage}/>
                    <DefaultLayout path="/createPasswordReset" component={createPasswordResetPage}/>
                    <DefaultLayout component={NotFound}/>
                </Switch>
        </BrowserRouter>
    }
}

export default App;