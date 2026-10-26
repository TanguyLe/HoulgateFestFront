import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
import AdminPage from "./admin/adminPage";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<DefaultLayout exact component={Homepage} />} />
                    <Route
                        path="/history/*"
                        element={<DefaultLayout component={HistoryPage} auth />}
                    />
                    <Route
                        path="/shotgun/*"
                        element={<DefaultLayout component={ShotgunPage} bigContainer auth />}
                    />
                    <Route
                        path="/trips/*"
                        element={<DefaultLayout component={TripPage} bigContainer auth />}
                    />
                    <Route
                        path="/scores/*"
                        element={<DefaultLayout component={ScoresPage} bigContainer auth />}
                    />
                    <Route
                        path="/admin/*"
                        element={<DefaultLayout component={AdminPage} bigContainer auth />}
                    />
                    <Route path="/contact/*" element={<DefaultLayout component={ContactPage} />} />
                    <Route
                        path="/register/*"
                        element={<DefaultLayout component={SignUpPage} notCo />}
                    />
                    <Route
                        path="/activateUser/*"
                        element={<DefaultLayout component={ActivateAccount} notCo />}
                    />
                    <Route
                        path="/passwordReset/*"
                        element={<DefaultLayout component={PasswordResetPage} notCo />}
                    />
                    <Route
                        path="/createPasswordReset/*"
                        element={<DefaultLayout component={CreatePasswordResetPage} notCo />}
                    />
                    <Route path="*" element={<DefaultLayout component={NotFound} />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
