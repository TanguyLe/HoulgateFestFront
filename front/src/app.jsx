import React from "react"
import {BrowserRouter, Route, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Dummy from "./shotgun/dummy"
import NotFound from "./mainLayout/notFound"
import UserLogin from "./mainLayout/login/UserLogin"
import DefaultLayout from './mainLayout/layout'

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div>
                <Switch>
                    <DefaultLayout path="/" exact component={Home}/>
                    <DefaultLayout path="/shotgun" component={Dummy}/>
                    <DefaultLayout path="/login" component={UserLogin}/>
                    <DefaultLayout component={NotFound}/>
                </Switch>
            </div>
        </BrowserRouter>
    }
}

export default App;
