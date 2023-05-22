import React from "react";
import { Image, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

class Homepage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <Header as="h2"> Bienvenue sur le site d'HoulgateFest 2023 ! </Header>
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>Schrtoumpfgatefest ou La Vie en Bleu</Header.Content>
                </Header>

                <div style={{ float: "left" }}>
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        size="medium"
                        floated="left"
                        src="static/banner.jpg"
                        bordered
                        spaced
                    />
                    <p>
                        Quelque part, dans un coin reculé et à l'abris des regards indiscrets,
                        existe un lieu secret peuplé de créatures fantastiques qué s'appelerio les
                        Schrtoumpfs !
                    </p>
                    <p>
                        Ces êtres bleus, mystérieux et pacifiques aiment se réunir au cours de
                        festivités s’étalant sur plusieurs jours. On assiste alors à une véritable
                        orgie de débauche ! Et cette année, ce sont tous les Schtroumpfs de France
                        qui sont conviés à participer !
                    </p>
                </div>

                <p>
                    Mais attention, ce week-end ne sera pas de tout repos ! Il faudra relever des
                    défis, mériter sa place, et surtout prendre garde à l’ignoble sorcier Gargamel
                    et à son démoniaque félin Azraël !
                </p>

                <p>Tenterez-vous l’aventure ?</p>

                <Image
                    style={{ margin: "10px 0 10px 0" }}
                    src="static/navi.jpeg"
                    centered
                    bordered
                    spaced
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <i> Schrtroumpf Zadiste, toujours chaud pour une 86 tiède</i>
                </div>

                <Header as="h3">
                    <Icon name="calendar" />
                    <Header.Content>C'est quand ?</Header.Content>
                </Header>

                <p>
                    L’édition 2023 aura lieu du <b>09/06/2023 au 11/06/2023 !</b>
                </p>
                <p>
                    Comme dit plus haut, les Schtroumpfs de toute la France sont attendus au village
                    cette année ! Il faut donc réserver son lit.
                </p>
                <p>
                    Soyez présent le 2 Juin à 18h sur cette plateforme pour choisir la couchette la
                    plus schtroumpfortable.
                </p>
                <p>
                    D'ici là pensez à vous <Link to="/register">inscrire</Link> et vérifiez bien que
                    vous pouvez vous connecter en amont. Le{" "}
                    <a target="_blank" href={SHOTGUN_GUIDE_LINK}>
                        guide
                    </a>{" "}
                    devrait vous aider à vous préparer.
                    <br />
                    <b>Organisez-vous pour le shotgun !</b>
                </p>
                <p>
                    Les moins réactifs iront dormir sur la plage avec les mouettes ! Ils pourront
                    aussi apporter leurs plus belles toiles de tente et sacs de couchage pour monter
                    un bidonville dans le jardin.
                    Il sera démantelé à l’aube par Gérald Darmanin en personne…
                    <Image
                        style={{ margin: "10px 0 10px 0" }}
                        src="static/flics.jpeg"
                        centered
                        bordered
                        spaced
                    />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <i> Protéger et servir… l’apéro !</i>
                    </div>
                </p>

                <Header as="h3">
                    <Icon name="map marker" />
                    <Header.Content>Restez informés</Header.Content>
                </Header>

                <p>
                    Pour être notifié directement au moment du Shotgun et au courant de toutes les
                    actualités du Schtroumpfgatefest : rendez-vous sur le groupeWhatsApp de
                    l’évènement !
                </p>

                <p>
                    Sur ce site vous êtes à bonne adresse si vous voulez{" "}
                    <Link to="/shotgun">shotgun votre chambre</Link>, débusquer{" "}
                    <Link to="/trips">un trajet en voiture</Link> ou suivre en direct le{" "}
                    <Link to="/scores">tableau des scores</Link>.
                </p>

                <div
                    style={{ float: "left", width: "100%", display: "flex", alignItems: "center" }}
                >
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        src="static/velo.jpeg"
                        size="small"
                        bordered
                        floated="left"
                        spaced
                    />
                    <div style={{ marginLeft: "auto" }}>
                        <p>Le Schtroumpfgatefest, j’y vais en Y ahah !</p>
                        <div style={{ float: "right" }}>
                            <b> Les orgas </b>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;
