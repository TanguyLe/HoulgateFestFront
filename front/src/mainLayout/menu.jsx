import React from "react";
import { Link } from "react-router-dom";

export const Header = () => (
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
					<Link to="/login">User</Link>
				</li>
			</ul>
		</nav>
	</header>
);

export default Header;
