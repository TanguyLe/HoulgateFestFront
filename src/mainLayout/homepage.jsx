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
                    <Header.Content>Soundgatefest mets la musique à l'honneur !</Header.Content>
                </Header>

                <div style={{ float: "left" }}>
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        size="medium"
                        floated="left"
                        src="static/banners/2024.jpg"
                        bordered
                        spaced
                    />
                    <p>
                        À l'heure des AI musicales douteuses et du retour en force de la chanson
                        paillarde, la musiqueu, la vraie, continue de battre fort dans nos coeurs.
                    </p>
                    <p>
                        Mais c'est quoi Jammy, la vraie musique ? Le Rap de Jul, la techno qui
                        tâche, ou uniquement Stromae et Maneskin ?? Plutôt Vitaa ou Vitalic ? Gaetan
                        ou Fabien Roussel ? C'est bien ce que nous allons essayer de départager !
                    </p>
                </div>

                <p>
                    Les trois équipes <b>Instru</b>, <b>Synthé</b> et <b>Voix</b> vont donc
                    s'affronter à travers des jeux variés pour faire rayonner sur Houlgate leurs
                    genres respectifs, et repartir avec la coupe. (
                    <i>spoiler: elle est petite cmb</i>)
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
                    <i> Image Genérée par IA N°1 </i>
                </div>

                <Header as="h3">
                    <Icon name="calendar" />
                    <Header.Content>C'est quand ?</Header.Content>
                </Header>

                <p>
                    L’édition 2024 aura lieu du <b>31/05/2024 au 02/06/2024 !</b>
                </p>
                <p>
                    Comme dit plus haut, tous les zicos de France ou de Babylone sont attendus à
                    Hougalte cette année ! Il faut donc réserver son lit.
                </p>
                <p>
                    Soyez présent le 12 mai à 20h sur cette plateforme pour choisir votre meilleur
                    hamac.
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
                    Yukulele pour refaire le monde, leurs chaises de camping pour fumer leurs plus
                    belles gitanes #cétaitmieuxavant, ou alors aller taper du pied au milieu des
                    mouettes au doux son des vagues #DrumAndSeaBass 🐟
                    <Image
                        style={{ margin: "10px 0 10px 0" }}
                        src="static/carrousel2.jpg"
                        centered
                        bordered
                        spaced
                    />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <i> Image Genérée par IA N°2 </i>
                    </div>
                </p>

                <Header as="h3">
                    <Icon name="map marker" />
                    <Header.Content>Restez informés</Header.Content>
                </Header>

                <p>
                    Pour être notifié directement au moment du Shotgun et au courant de toutes les
                    actualités du Soundgatefest : rendez-vous sur le groupeWhatsApp de l’évènement !
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
                    <i> Image Genérée par IA N°3 </i>
                </div>

                <div style={{ float: "right" }}>
                    <b> Les orgas </b>
                </div>
            </div>
        );
    }
}

export default Homepage;
