import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
	<header>
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/shotgun">Shotgun</Link>
				</li>
				<li>
					<Link to="/log-in-user">User</Link>
				</li>
			</ul>
		</nav>
	</header>
);

export default Header;
