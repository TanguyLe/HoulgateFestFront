import React from "react";
import {Image} from "semantic-ui-react"
import {Link} from "react-router-dom";


class Home extends React.Component {
	render() {
		return (
			<div className="WelcomePage">
				<h1> Bienvenue sur le site d'HoulgateFest ! </h1>
				<p>
					Il sera en constante évolution, mais pour l'instant l'objectif est de vous permettre de réserver l'endroit où vous dormirez dans la maison.
					Enfin pas exactement "pour l'instant",
					car le shotgun des chambres ouvrira ses portes le XXXX à XXXXX! Surtout notez bien la date et l'heure, vous n'aurez pas de seconde chance.
				</p>
				<p>
					D'ici là pensez à vous <Link to="/register">inscrire</Link> et vérifiez bien que vous pouvez vous connecter.
					Le petit <a href="" >guide</a> disponible devrait vous aider à vous préparer. Organisez-vous pour le shotgun!
				</p>
				Pour ceux qui sont invités, il y a plus de détails sur l'évènement <a target="blank" href="https://www.facebook.com/events/412313352536608">Facebook</a>.
				<br/>
				<br/>
				<div className="bannerContainer">
					<Image src="final_banner_fb.jpg" verticalAlign="middle" fluid/>
				</div>
            </div>
		);
	}
}

export default Home;
