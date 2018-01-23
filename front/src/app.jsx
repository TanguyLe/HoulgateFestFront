import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Home from './mainLayout/home.component'
import Header from './mainLayout/menu.component'
import Dummy from './shotgun/dummy.component'
import NotFound from './mainLayout/notFound.component'
import UserLogin from "./mainLayout/login/UserLogin"

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div><Header/>
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
