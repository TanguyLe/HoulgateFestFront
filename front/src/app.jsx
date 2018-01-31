import React from "react"
import {BrowserRouter, Route, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Header from "./mainLayout/menu"
import Dummy from "./shotgun/shotgunPage"
import NotFound from "./mainLayout/notFound"
import UserLogin from "./mainLayout/login/UserLogin"


class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div className="fullWidth fullHeight"><Header/>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/shotgun" component={Dummy}/>
                    <Route path="/login" component={UserLogin}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </BrowserRouter>
    }
}

export default App;
