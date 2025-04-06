import React from "react";
import { Image, Header, Icon, Grid, Button, Card } from "semantic-ui-react";
import { Link } from "react-router-dom";

const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

class Homepage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <div className="welcome-banner">
                    <Header as="h1" className="welcome-title">Bienvenue sur HoulgateFest !</Header>
                    <div className="welcome-subtitle">
                        <p>L'évènement musical de l'année à ne pas manquer</p>
                    </div>
                </div>

                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Image
                                className="main-image"
                                size="large"
                                src="static/banners/2024.jpg"
                                bordered
                                rounded
                            />
                        </Grid.Column>
                        <Grid.Column width={8} verticalAlign="middle">
                            <Header as="h3" className="section-title">
                                <Icon name="heart" className="section-icon" />
                                <Header.Content>Soundgatefest met la musique à l'honneur !</Header.Content>
                            </Header>
                            <p>
                                À l'heure des IA musicales douteuses et du retour en force de la chanson
                                paillarde, la musiqueu, la vraie, continue de battre fort dans nos coeurs.
                            </p>
                            <p>
                                Mais c'est quoi Jamy, la vraie musique ? Le Rap de Jul, la techno qui tâche,
                                ou uniquement Stromae et Maneskin ?? Plutôt Vitaa ou Vitalic ? Gaetan ou
                                Fabien Roussel ? C'est bien ce que nous allons essayer de départager !
                            </p>
                            <p>
                                Les trois équipes <b>Instru</b>, <b>Synthé</b> et <b>Voix</b> vont donc
                                s'affronter à travers des jeux variés pour faire rayonner sur Houlgate leurs
                                genres respectifs, et repartir avec la coupe. (
                                <i>spoiler: elle est petite cmb</i>)
                            </p>
                            <p>Tenterez-vous l'aventure ?</p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <div className="image-gallery">
                    <Image
                        className="gallery-image"
                        src="static/carrousel1.jpg"
                        bordered
                        rounded
                    />
                    <div className="image-caption">
                        <i>Image genérée par IA n°1</i>
                    </div>
                </div>

                <div className="info-section">
                    <Header as="h3" className="section-title">
                        <Icon name="calendar" className="section-icon" />
                        <Header.Content>C'est quand ?</Header.Content>
                    </Header>

                    <Card fluid className="event-card">
                        <Card.Content>
                            <Card.Header>Édition 2024</Card.Header>
                            <Card.Meta>Du 31 mai au 2 juin 2024</Card.Meta>
                            <Card.Description>
                                <p>
                                    Comme dit plus haut, tous les zicos de France ou de Babylone sont attendus à
                                    Houlgate cette année ! Il faut donc réserver son lit.
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
                                </p>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button as={Link} to="/shotgun" primary>
                                <Icon name="signup" /> Participer au shotgun
                            </Button>
                        </Card.Content>
                    </Card>
                </div>

                <p>
                    Les moins réactifs pourront aussi apporter leurs plus belles toiles de tente et
                    Yukulele pour refaire le monde, leurs chaises de camping pour fumer leurs plus
                    belles gitanes #cétaitmieuxavant, ou alors aller taper du pied au milieu des
                    mouettes au doux son des vagues #DrumAndSeaBass 🐟
                </p>

                <div className="image-gallery">
                    <Image
                        className="gallery-image"
                        src="static/carrousel2.jpg"
                        bordered
                        rounded
                    />
                    <div className="image-caption">
                        <i>Image genérée par IA n°2</i>
                    </div>
                </div>

                <div className="info-section">
                    <Header as="h3" className="section-title">
                        <Icon name="map marker" className="section-icon" />
                        <Header.Content>Restez informés</Header.Content>
                    </Header>

                    <p>
                        Pour être notifié directement au moment du Shotgun et au courant de toutes les
                        actualités du Soundgatefest : rendez-vous sur le groupe WhatsApp de l'évènement !
                    </p>

                    <div className="actions-container">
                        <Button as={Link} to="/shotgun" primary>
                            <Icon name="bed" /> Shotgun votre chambre
                        </Button>
                        <Button as={Link} to="/trips" primary>
                            <Icon name="car" /> Trouver un trajet
                        </Button>
                        <Button as={Link} to="/scores" primary>
                            <Icon name="trophy" /> Voir les scores
                        </Button>
                    </div>
                </div>

                <div className="image-gallery">
                    <Image
                        className="gallery-image"
                        src="static/carrousel3.jpg"
                        bordered
                        rounded
                    />
                    <div className="image-caption">
                        <i>Image genérée par IA n°3</i>
                    </div>
                </div>

                <div className="signature">
                    <b>Les orgas</b>
                </div>
            </div>
        );
    }
}

export default Homepage;
