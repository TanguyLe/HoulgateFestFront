import React from "react"
import {BrowserRouter, Switch} from "react-router-dom"

import Home from "./mainLayout/home"
import Dummy from "./shotgun/dummy"
import NotFound from "./mainLayout/notFound"
import UserLogin from "./login/components"
import DefaultLayout from './mainLayout/layout'
import ContactForm from './contact/contact'


class App extends React.Component {
    render() {
        return <BrowserRouter>
                <Switch>
                    <DefaultLayout path="/" exact component={Home}/>
                    <DefaultLayout path="/shotgun" component={Dummy} bigContainer/>
                    <DefaultLayout path="/login" component={UserLogin}/>
                    <DefaultLayout path="/contact" component={ContactForm}/>
                    <DefaultLayout component={NotFound}/>
                </Switch>
        </BrowserRouter>
    }
}

export default App;