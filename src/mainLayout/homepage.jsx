import React from "react";
import {Image, Header, Icon, Popup} from "semantic-ui-react";
import {Link} from "react-router-dom";


class Homepage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <Header as="h2"> Bienvenue sur le site d'HoulgateFest 2021 ! </Header>
                <Header as="h3">
                    <Icon name='heart'/>
                    <Header.Content>HoulgateFest et la Gaule de Bois</Header.Content>
                </Header>

                <Image style={{"margin": "10px 0 10px 0"}} src="static/Banniere_HF_2021.png" centered bordered spaced/>

                <p>
                Nous sommes en 50 avant Jésus-Christ. Toute cette p*tain de Gaule est occupée par les Romains.
                </p>
                <p>
                    Toute ? Non ! Un village peuplé d’irréductibles Gaulois résiste encore et toujours à l’envahisseur.
                    Houlgate, lieu de refuge pour une tribu gauloise, fait face aux virulents et purulents peuples du Nord. Des Vikings fiers d’avoir pris position bien fermement sur leur Manche, dure.
                </p>
                <p>
                    Romains, Gaulois, Vikings, tous se disputent encore la suprématie de la Côte Fleurie !
                </p>

                <p>
                    Cette année, décision est prise de résoudre ce problème : prenons le temps d’un weekend
                    pour organiser une grande assemblée tri-tribu.
                    Au terme de ces quarante-huit heures, une seule peuplade sera officiellement déclarée grande
                    gagnante et ses membres pourront repartir avec la Gaule de Bois  !
                </p>

                <Header as="h3">
                    <Icon name='calendar'/>
                    <Header.Content>C'est quand ?</Header.Content>
                </Header>

                <p>
                    Cette édition 2021 se déroulera du <b>vendredi 11 au dimanche 13 Juin</b> (
                    <i className="smalltext">sauf contre-indication dû à ce connard de virus - crevard de virus).</i><br/>
                </p>
                <div style={{"display": "inline-block", "width": "100%"}}>
                    <Image src="static/tangus.jpg" size="tiny" floated={"left"}/>
                    <p style={{"display": "inline", "transform": "translateY(50%)", "position": "absolute"}}>
                        <i>
                            "Une fois n’étant pas coutume, je vous ait laissé le choix dans la date"
                            <br/> <b>Tangus</b>
                        </i>
                    </p>
                </div>
                <p>
                    Et 3 tribus ça en fait du monde dans la chaumière normande, heureusement vous pouvez réserver votre lit ici.
                    Donc soyez présent le <b>lundi 17 mai à 20h</b> sur cette plateforme pour choisir votre espace de siestasse.
                </p>
                <p>
                    D'ici là pensez à vous <Link to="/register">inscrire</Link> et vérifiez bien
                    que vous pouvez vous connecter en amont.
                    Le <a href={"https://docs.google.com/document/d/10UAgpsh7cdAsPlyEdn25XaX9jstU9zNsYuC5-c2NnP8/edit?usp=sharing"}>guide</a> devrait
                    vous aider à vous préparer.
                    <br/><b>Organisez-vous pour le shotgun !</b>
                </p>
                <p>
                    Attention pour cette édition 2021 le HoulgateFest accueille 3 tribus et donc de nombreux invités. <br/>
                    Pour les moins réactifs vous pouvez également réserver un gîte ou une belle taverne non loin.
                    Vous pouvez sinon prévoir toiles de tente et sacs de couchage pour monter le camp dans le jardin !
                </p>

                <Header as="h3">
                    <Icon name='map marker'/>
                    <Header.Content>Restez informés</Header.Content>
                </Header>

                <p>
                    Pour être notifié directement au moment du Shotgun, être au courant de toutes les actualités du HoulgateFest,
                    soutenir votre tribu et surtout sélectionner les packs Bouffe et Alcool:
                    rendez-vous sur <a href={"https://www.facebook.com/events/773462923524929"}>l’événement Facebook</a> ! <br/>
                </p>
                <p>
                    Sur ce site vous êtes à bonne adresse si vous voulez <Link to="/shotgun">shotgun votre chambre</Link>,
                    débusquer <Link to="/trips">un trajet en voiture</Link> ou suivre
                    en direct le <Link to="/scores">tableau des scores</Link> de La Gaule de Bois. <br/>
                </p>
                <p>
                    Et si vous êtes adepte de plaisirs coquins: allez soutenir notre hôte en le suivant
                    sur son <Popup
                        flowing hoverable basic
                        position="top left"
                        content=<Image
                            src="https://s1.qwant.com/thumbr/0x0/8/1/8ec2071cc6cb70917a6a1b7d4ec533/b_1_q_0_p_0.jpg?u=http%3A%2F%2Fs3.amazonaws.com%2Frapgenius%2F1776.jpg&q=0&b=1&p=0&a=1"
                            centered bordered spaced
                        />
                        trigger={<a style={{"display": "inline-block"}}>Onlyfans</a>}
                    /> !
                </p>
                <div style={{"float": "right"}}><b> Hugo Bis </b></div>

            </div>
        );
    }
}

export default Homepage;
