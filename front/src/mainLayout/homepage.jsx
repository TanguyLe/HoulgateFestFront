import React from "react";
import {Image, Header, Icon, Reveal} from "semantic-ui-react"
import {Link} from "react-router-dom";


class Homepage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <Header as="h2"> Bienvenue sur le site d'HoulgateFest 2020 ! </Header>

                <Header as="h3">
                    <Icon name='heart'/>
                    <Header.Content>Le HoulgateFest késako ?</Header.Content>
                </Header>

                Créé à l’aube de l’été 2018, le fameux “HoulgateFest” est en réalité un moment de fête ayant lieu
                dans
                le bourg de Houlgate <i className="smalltext"> (d'où le nom, assez explicite en fin de compte,
                quand on veut bien
                se donner la peine de s’y pencher 5 à 10 minutes quoi... perso
                je trouve que c’est balèze étymologiquement... après chacun se fera son avis hein).  </i>
                Ce rendez-vous est maintenant devenu annuel, il est d’ailleurs considéré depuis comme
                un véritable must pour tous les déglingos de la night de la Côte-Fleurie.
                <b> En résumé, HoulgateFest qu’est-ce que c’est ?</b> <br/>
                Un weekend festif mettant à l’honneur blagues douteuses, jeux à la con et alcool forts !


                <Header as="h3">
                    <Icon name='calendar'/>
                    <Header.Content>La Date</Header.Content>
                </Header>

                Cette édition 2020 se déroulera du vendredi 26 au dimanche 28 Juin
                <i className="smalltext"> (Sauf contre-indication si le coro continue). </i>


                <Header as="h3">
                    <Icon name='map marker'/>
                    <Header.Content>Le Lieu</Header.Content>
                </Header>

                <p>
                    La bâtisse est certes spacieuse mais ses murs n’ont rien à voir avec l’état que
                    pourrait avoir l’élastique de mon slop fétiche (au réveil notamment).
                    Pour le dire avec vos mots: ses murs ne sont pas extensibles quoi !
                </p>
                <p>
                    Mais le génie au physique de rêve et au poil dru qui nous sert d’organisateur a tout prévu.
                    Si vous souhaitez “pécho une brechan” comme disent les millenials lisez
                    le paragraphe juste en dessous. Oui là, juste la ligne plus bas.
                </p>


                <Header as="h3">
                    <Icon name='bed'/>
                    <Header.Content>Le Shotgun</Header.Content>
                </Header>

                Pour faire simple il y aura surement plus de fêtards que de chambres disponibles.
                Donc soyez présent <b>le vendredi 12 Juin à 20h (heure de Paris)</b> sur cette plateforme
                pour réserver votre nid douillet.
                D'ici là pensez à vous <Link to="/register">inscrire</Link> et vérifiez
                bien que vous pouvez vous connecter.
                Le <a href="https://docs.google.com/document/d/10UAgpsh7cdAsPlyEdn25XaX9jstU9zNsYuC5-c2NnP8/edit?usp=sharing" target="blank">guide</a> devrait
                vous aider à vous préparer. Organisez-vous pour le shotgun !

                <Header as="h3">
                    <Icon name='lightning'/>
                    <Header.Content>Le Thème</Header.Content>
                </Header>

                <Reveal animated='fade'>
                    <Reveal.Content visible>
                        <Image src="gandalf_v2.jpg" size="small" floated="left"/>
                    </Reveal.Content>
                    <Reveal.Content hidden>
                        <Image src="pere_fouras.jpg" size="small" floated="left"/>
                    </Reveal.Content>
                </Reveal>
                <p>
                    L’orga nous a pondu une nouvelle idée cette année: un thème ! Par chance il a
                    choisi un incontournable pour ne décevoir personne : <b>l’univers d’Harry Potter</b>.
                    Ca tombe bien je suis fan de la 1ère heure ! <br/>
                    J’adore le magicien blanc, ouais Gandalf ouais, c’est trop un perso qui claque je trouve.
                </p>
                <p>
                    Pour avoir toutes les notifications concernant
                    le shotgun mais aussi l’organisation (choix d’alcool, de bouffe,...)
                    répondez à <a target="blank" href="https://www.facebook.com/events/1263546553855244/">
                    l’événement Facebook </a>.
                </p>
                <div style={{"float": "right"}}><b> Hugo Bis </b></div>

            </div>
        );
    }
}

export default Homepage;
