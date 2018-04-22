import React from "react"
import {BrowserRouter, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Dummy from "./shotgun/dummy"
import NotFound from "./mainLayout/notFound"
import SignUpPage from "./login/components/signUpPage"
import ReadUser from "./login/components/ReadUser"
import activateAccount from "./login/components/activateAccountPage"
import resetPasswordPage from "./login/components/resetPasswordPage"
import createPasswordResetPage from "./login/components/createPasswordResetPage"
import DefaultLayout from './mainLayout/layout'


class App extends React.Component {
    render() {
        return <BrowserRouter>
                <Switch>
                    <DefaultLayout path="/" exact component={Home}/>
                    <DefaultLayout path="/shotgun" component={Dummy}/>
                    <DefaultLayout path="/register" component={SignUpPage}/>
                    <DefaultLayout path="/test" component={ReadUser}/>
                    <DefaultLayout path="/activateUser" component={activateAccount}/>
                    <DefaultLayout path="/resetPassword" component={resetPasswordPage}/>
                    <DefaultLayout path="/createPasswordReset" component={createPasswordResetPage}/>
                    <DefaultLayout component={NotFound}/>
                </Switch>
        </BrowserRouter>
    }
}

export default App;