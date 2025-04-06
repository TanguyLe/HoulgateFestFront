import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Homepage from "./mainLayout/homepage";

import ShotgunPage from "./shotgun/shotgunPage";
import NotFound from "./mainLayout/components/notFound";
import SignUpPage from "./login/signUpPage";
import ActivateAccount from "./login/activateAccountPage";
import PasswordResetPage from "./login/passwordResetPage";
import CreatePasswordResetPage from "./login/createPasswordResetPage";
import DefaultLayout from "./mainLayout/components/layout";
import ContactPage from "./contact/contactPage";
import TripPage from "./trip/tripPage";
import ScoresPage from "./scores/scoresPage";
import HistoryPage from "./history/historyPage";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="app-container">
                    <Switch>
                        <Route exact path="/">
                            <DefaultLayout exact component={Homepage} />
                        </Route>
                        <Route path="/history">
                            <DefaultLayout component={HistoryPage} auth />
                        </Route>
                        <Route path="/shotgun">
                            <DefaultLayout component={ShotgunPage} bigContainer auth />
                        </Route>
                        <Route path="/trips">
                            <DefaultLayout component={TripPage} bigContainer auth />
                        </Route>
                        <Route path="/scores">
                            <DefaultLayout component={ScoresPage} bigContainer auth />
                        </Route>
                        <Route path="/contact">
                            <DefaultLayout component={ContactPage} />
                        </Route>
                        <Route path="/register">
                            <DefaultLayout component={SignUpPage} notCo />
                        </Route>
                        <Route path="/activateUser">
                            <DefaultLayout component={ActivateAccount} notCo />
                        </Route>
                        <Route path="/passwordReset">
                            <DefaultLayout component={PasswordResetPage} notCo />
                        </Route>
                        <Route path="/createPasswordReset">
                            <DefaultLayout component={CreatePasswordResetPage} notCo />
                        </Route>
                        <Route path="*">
                            <DefaultLayout component={NotFound} />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
