import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Homepage from "./mainLayout/homepage";

import ShotgunPage from "./shotgun/shotgunPage";
import NotFound from "./mainLayout/components/notFound";
import SignUpPage from "./login/signUpPage";
import ActivateAccount from "./login/activateAccountPage";
import PasswordResetPage from "./login/passwordResetPage";
import CreatePasswordResetPage from "./login/createPasswordResetPage";
import AppShell from "./mainLayout/components/menu";
import DefaultLayout from "./mainLayout/components/layout";
import ContactPage from "./contact/contactPage";
import ChecklistPage from "./checklist/checklistPage";
import TripPage from "./trip/tripPage";
import ScoresPage from "./scores/scoresPage";
import HistoryPage from "./history/historyPage";
import AdminPage from "./admin/adminPage";

class App extends React.Component {
    render() {
        return (
            <Router>
                <AppShell>
                    <Routes>
                        <Route
                            path="/"
                            element={<DefaultLayout component={Homepage} width="full" />}
                        />
                        <Route
                            path="/history/*"
                            element={<DefaultLayout component={HistoryPage} auth />}
                        />
                        <Route
                            path="/shotgun/*"
                            element={<DefaultLayout component={ShotgunPage} width="wide" auth />}
                        />
                        <Route
                            path="/trips/*"
                            element={<DefaultLayout component={TripPage} auth />}
                        />
                        <Route
                            path="/scores/*"
                            element={<DefaultLayout component={ScoresPage} auth />}
                        />
                        <Route
                            path="/admin/*"
                            element={<DefaultLayout component={AdminPage} width="wide" auth />}
                        />
                        <Route
                            path="/checklist/*"
                            element={<DefaultLayout component={ChecklistPage} width="narrow" />}
                        />
                        <Route
                            path="/contact/*"
                            element={<DefaultLayout component={ContactPage} width="narrow" />}
                        />
                        <Route
                            path="/register/*"
                            element={<DefaultLayout component={SignUpPage} width="narrow" notCo />}
                        />
                        <Route
                            path="/activateUser/*"
                            element={
                                <DefaultLayout component={ActivateAccount} width="narrow" notCo />
                            }
                        />
                        <Route
                            path="/passwordReset/*"
                            element={
                                <DefaultLayout component={PasswordResetPage} width="narrow" notCo />
                            }
                        />
                        <Route
                            path="/createPasswordReset/*"
                            element={
                                <DefaultLayout
                                    component={CreatePasswordResetPage}
                                    width="narrow"
                                    notCo
                                />
                            }
                        />
                        <Route path="*" element={<DefaultLayout component={NotFound} />} />
                    </Routes>
                </AppShell>
            </Router>
        );
    }
}

export default App;
