import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/common/home.component";
import Dummy from "./components/shotgun/dummy.component";
import Header from "./components/common/menu.component";
import UserLogin from "./containers/UserLogin";

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
