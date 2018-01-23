import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./mainLayout/home.component";
import Dummy from "./shotgun/dummy.component";
import Header from "./mainLayout/menu.component";
import UserLogin from "./mainLayout/login/UserLogin";

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Header />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route
							exact
							path="/user-log-in"
							component={UserLogin}
						/>
						<Route path="/shotgun" component={Dummy} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
