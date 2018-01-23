import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Home from './common/home.component'
import Dummy from './shotgun/dummy.component'
import Header from './common/menu.component'
import NotFound from './common/notFound.component'

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div><Header/>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/shotgun" component={Dummy}/>
					<Route path="/user-log-in" component={UserLogin}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </BrowserRouter>
    }
}

export default App;
