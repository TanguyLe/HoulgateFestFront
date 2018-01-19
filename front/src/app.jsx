import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './common/home.component'
import Dummy from './shotgun/dummy.component'
import Header from './common/menu.component'

class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div><Header/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/shotgun" component={Dummy}/>
                </Switch>
            </div>
        </BrowserRouter>
    }
}

export default App
