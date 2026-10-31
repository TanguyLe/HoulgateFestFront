import React, { lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Homepage from "./mainLayout/homepage";
import NotFound from "./mainLayout/components/notFound";
import DefaultLayout from "./mainLayout/components/layout";

// The homepage comes with the bundle, the other pages are loaded when they are opened
const ShotgunPage = lazy(() => import(/* webpackChunkName: "shotgun" */ "./shotgun/shotgunPage"));
const SignUpPage = lazy(() => import(/* webpackChunkName: "account" */ "./login/signUpPage"));
const ActivateAccount = lazy(
    () => import(/* webpackChunkName: "account" */ "./login/activateAccountPage"),
);
const PasswordResetPage = lazy(
    () => import(/* webpackChunkName: "account" */ "./login/passwordResetPage"),
);
const CreatePasswordResetPage = lazy(
    () => import(/* webpackChunkName: "account" */ "./login/createPasswordResetPage"),
);
const ContactPage = lazy(() => import(/* webpackChunkName: "contact" */ "./contact/contactPage"));
const ChecklistPage = lazy(
    () => import(/* webpackChunkName: "checklist" */ "./checklist/checklistPage"),
);
const TripPage = lazy(() => import(/* webpackChunkName: "trips" */ "./trip/tripPage"));
const ScoresPage = lazy(() => import(/* webpackChunkName: "scores" */ "./scores/scoresPage"));
const HistoryPage = lazy(() => import(/* webpackChunkName: "history" */ "./history/historyPage"));
const AdminPage = lazy(() => import(/* webpackChunkName: "admin" */ "./admin/adminPage"));

// Each page with its title and description; account and admin pages aren't indexed
const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<DefaultLayout component={Homepage} />} />
            <Route
                path="/history/*"
                element={
                    <DefaultLayout
                        component={HistoryPage}
                        auth
                        title="Historique"
                        description="Les éditions du HoulgateFest depuis 2018, en photos."
                    />
                }
            />
            <Route
                path="/shotgun/*"
                element={
                    <DefaultLayout
                        component={ShotgunPage}
                        bigContainer
                        auth
                        title="Shotgun"
                        description="Le shotgun des lits de la villa pour le weekend du HoulgateFest."
                    />
                }
            />
            <Route
                path="/trips/*"
                element={
                    <DefaultLayout
                        component={TripPage}
                        bigContainer
                        auth
                        title="Trajets"
                        description="Les trajets en voiture pour venir au HoulgateFest."
                    />
                }
            />
            <Route
                path="/scores/*"
                element={
                    <DefaultLayout
                        component={ScoresPage}
                        bigContainer
                        auth
                        title="Scores"
                        description="Le tableau des scores du HoulgateFest, en direct."
                    />
                }
            />
            <Route
                path="/admin/*"
                element={
                    <DefaultLayout
                        component={AdminPage}
                        bigContainer
                        auth
                        noindex
                        title="Administration"
                    />
                }
            />
            <Route
                path="/checklist/*"
                element={
                    <DefaultLayout
                        component={ChecklistPage}
                        title="Checklist"
                        description="Tout ce qu'il faut prévoir avant de venir au HoulgateFest."
                    />
                }
            />
            <Route
                path="/contact/*"
                element={
                    <DefaultLayout
                        component={ContactPage}
                        title="Contact"
                        description="Écrire aux organisateurs du HoulgateFest."
                    />
                }
            />
            <Route
                path="/register/*"
                element={<DefaultLayout component={SignUpPage} notCo noindex title="Inscription" />}
            />
            <Route
                path="/activateUser/*"
                element={
                    <DefaultLayout
                        component={ActivateAccount}
                        notCo
                        noindex
                        title="Activation du compte"
                    />
                }
            />
            <Route
                path="/passwordReset/*"
                element={
                    <DefaultLayout
                        component={PasswordResetPage}
                        notCo
                        noindex
                        title="Nouveau mot de passe"
                    />
                }
            />
            <Route
                path="/createPasswordReset/*"
                element={
                    <DefaultLayout
                        component={CreatePasswordResetPage}
                        notCo
                        noindex
                        title="Mot de passe oublié"
                    />
                }
            />
            <Route
                path="*"
                element={<DefaultLayout component={NotFound} noindex title="Page introuvable" />}
            />
        </Routes>
    </Router>
);

export default App;
