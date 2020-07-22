import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"

import Homepage from "./mainLayout/homepage"

import ShotgunPage from "./shotgun/shotgunPage"
import NotFound from "./mainLayout/components/notFound"
import SignUpPage from "./login/signUpPage"
import ActivateAccount from "./login/activateAccountPage"
import PasswordResetPage from "./login/passwordResetPage"
import CreatePasswordResetPage from "./login/createPasswordResetPage"
import DefaultLayout from './mainLayout/components/layout'
import ContactPage from './contact/contactPage'
import TripPage from './trip/tripPage'
import ScoresPage from "./scores/scoresPage"


class App extends React.Component {
    render() {
        return <Router>
                <Switch>
                    <Route exact path="/">
                        <DefaultLayout exact component={Homepage}/>
                    </Route>
                    <Route path="/shotgun">
                        <DefaultLayout component={ShotgunPage} bigContainer/>
                    </Route>
                    <Route path="/trips">
                        <DefaultLayout component={TripPage} bigContainer/>
                    </Route>
                    <Route path="/scores">
                        <DefaultLayout component={ScoresPage} bigContainer/>
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