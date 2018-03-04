import React from "react"
import {BrowserRouter, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Dummy from "./shotgun/dummy"
import NotFound from "./mainLayout/notFound"
import SignUpForm from "./login/components/SignUpForm"
import ReadUser from "./login/components/ReadUser"
import DefaultLayout from './mainLayout/layout'


class App extends React.Component {
    render() {
        return <BrowserRouter>
                <Switch>
                    <DefaultLayout path="/" exact component={Home}/>
                    <DefaultLayout path="/shotgun" component={Dummy}/>
                    <DefaultLayout path="/register" component={SignUpForm}/>
                    <DefaultLayout path="/test" component={ReadUser}/>
                    <DefaultLayout component={NotFound}/>
                </Switch>
        </BrowserRouter>
    }
}

export default App;