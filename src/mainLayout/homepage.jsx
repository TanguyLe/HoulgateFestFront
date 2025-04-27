import React from "react";
import { Image, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

class Homepage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <Header as="h2"> Bienvenue sur le site d'HoulgateFest ! </Header>
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>DoublegateFest met l’alchimie à l’honneur ! </Header.Content>
                </Header>

                <div style={{ float: "left" }}>
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        size="medium"
                        floated="left"
                        src="static/banners/2025.jpg"
                        bordered
                        spaced
                    />
                    <p>
                        Dans un monde où les contrastes s'harmonisent, l'heure est venue de célébrer
                        le "Duo Choc" ! Une rencontre explosive entre deux esprits, deux talents,
                        deux univers qui s'unissent pour créer une alliance sans pareille.
                    </p>
                    <p>
                        Que ce soit à travers la musique, le cinéma ou la gastronomie, laissez-vous
                        emporter par cette magie qui se produit lorsque les opposés s'attirent.
                    </p>
                </div>

                <p>
                    Préparez-vous à une soirée inoubliable, où chaque duo apportera son propre éclat
                    à notre fête colorée ! Nos duos vont donc s’affronter dans des jeux variés pour
                    faire rayonner sur Houlgate leurs personnalités flamboyantes et repartir, qui
                    sait… avec un cadeau probablement exceptionnel !
                </p>

                <p>Tenterez-vous l’aventure ?</p>

                <Image
                    style={{ margin: "10px 0 10px 0" }}
                    src="static/carrousel1.jpg"
                    centered
                    bordered
                    spaced
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <i> Image genérée par IA n°1 </i>
                </div>

                <Header as="h3">
                    <Icon name="calendar" />
                    <Header.Content>C'est quand ?</Header.Content>
                </Header>

                <p>
                    L’édition 2025 aura lieu du <b>20/06/2025 au 22/06/2025 !</b>
                </p>
                <p>
                    Comme dit plus haut, tous nos duos sont attendus avec impatience à Houlgate,
                    qu’ils viennent du passé ou de votre assiette ! Cependant, seul votre lit est à
                    réserver sur ce site !
                </p>
                <p>
                    Soyez présents le 1er juin à 20h sur cette plateforme pour choisir votre
                    meilleur hamac !
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
                    Les moins réactifs pourront aussi apporter leurs plus belles toiles de tente et
                    leurs meilleurs costumes de duo ! Après tout, la surprise fait toujours son
                    effet. Sinon, vous pourrez toujours refaire le monde autour du feu en brûlant
                    vos fausses moustaches, parce que vous avez toujours été imberbe !
                    #PosticheMoustachu
                    <Image
                        style={{ margin: "10px 0 10px 0" }}
                        src="static/carrousel2.jpg"
                        centered
                        bordered
                        spaced
                    />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <i> Image genérée par IA n°2 </i>
                    </div>
                </p>

                <Header as="h3">
                    <Icon name="map marker" />
                    <Header.Content>Restez informés</Header.Content>
                </Header>

                <p>
                    Pour être notifié directement au moment du Shotgun et au courant de toutes les
                    actualités du DoublegateFest : rendez-vous sur le groupeWhatsApp de l’évènement
                    !
                </p>

                <p>
                    Sur ce site vous êtes à bonne adresse si vous voulez{" "}
                    <Link to="/shotgun">shotgun votre chambre</Link>, débusquer{" "}
                    <Link to="/trips">un trajet en voiture</Link> ou suivre en direct le{" "}
                    <Link to="/scores">tableau des scores</Link>.
                </p>

                <Image
                    style={{ margin: "10px 10px 10px 10px" }}
                    src="static/carrousel3.jpg"
                    bordered
                    spaced
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <i> Image genérée par IA n°3 </i>
                </div>

                <div style={{ float: "right" }}>
                    <b> Les orgas </b>
                </div>
            </div>
        );
    }
}

export default Homepage;
