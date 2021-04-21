import React from "react";
import { Header, Icon, Image } from "semantic-ui-react";
import ImagesCarousel from "./components/carousel";

class HistoryPage extends React.Component {
    render() {
        return (
            <div className="WelcomePage">
                <Header as="h2"> Gloryhoul of Fame </Header>
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>
                        <a href="https://www.facebook.com/events/412313352536608/" target="_blank">
                            2018: Naissance du HoulgateFest (8 au 10 Juin)
                        </a>
                    </Header.Content>
                </Header>
                <Image
                    style={{ paddingBottom: "10px" }}
                    src="static/banners/2018.jpg"
                    centered
                    spaced
                />

                <p>
                    Les pionniers de la nouba normande investissent Houlgate le temps d’un weekend.
                    Les survivants décrivent encore aujourd’hui un état d’esprit commun à toutes les
                    personnes présentes sur place en 2018: une passion non dissimulée pour le
                    houblon, les spiritueux et la boisson bien distillée en général.
                </p>
                <p>Aucune trace de compétition. Le shotgun sur le site échoue lamentablement.</p>
                <p>
                    Passage remarqué et remarquable de cette joyeuse équipée au Royalty,
                    établissement culinaire (ayant dû fermer pour 6 mois de travaux et près de 14
                    plaintes de la Mairie et des riverains suite à cet événement).
                </p>
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2018/edition1_1.jpg" },
                        { path: "static/pictures/2018/edition1_2.jpg" },
                        { path: "static/pictures/2018/edition1_3.jpg" },
                    ]}
                />
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>
                        <a href="https://www.facebook.com/events/420496642092857/" target="_blank">
                            2019: HoulgateFest Le Retour (27 au 29 Juin)
                        </a>
                    </Header.Content>
                </Header>
                <Image
                    style={{ paddingBottom: "10px" }}
                    src="static/banners/2019.jpg"
                    centered
                    spaced
                />

                <p>
                    Un an plus tard, la fiesta est de retour à Houlgate. La passion de l’alcool est
                    toujours présente et se voit même renforcée avec la dégustation de la fameuse
                    bière artisanale “Délivrez-nous du Malt”.
                </p>
                <p>Première compétition également: les Olympiadasses !</p>
                <p>
                    Deux équipes s’affrontent tout au long du weekend. Ce sera finalement la Team
                    Tirajosaure qui prendra le meilleur sur la Team Sir Concis.
                </p>
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2019/edition2_1.jpg" },
                        { path: "static/pictures/2019/edition2_2.jpg" },
                        { path: "static/pictures/2019/edition2_3.jpg" },
                    ]}
                />
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>
                        <a href="https://www.facebook.com/events/1263546553855244/" target="_blank">
                            2020: HoulgateFest et la Coupe de F (25 au 27 Septembre)
                        </a>
                    </Header.Content>
                </Header>
                <Image
                    style={{ paddingBottom: "10px" }}
                    src="static/banners/2020.png"
                    centered
                    spaced
                />

                <p>
                    Édition initialement prévue le weekend du 26 juin 2020 mais repoussée cause
                    Covid.
                </p>
                <p>
                    Cette année, Houlgate se transforme en Poulgate et les différents participants
                    sont répartis dans quatre maisons de sorciers.
                </p>
                <p>
                    L’objectif étant d’accumuler les points lors de quiz, jeux et défis afin de
                    faire gagner sa maison. Une fois n’est pas coutume, ce sont les Serpentards qui
                    ramenèrent la coupe à la maison.
                </p>
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2020/edition3_1.jpg" },
                        { path: "static/pictures/2020/edition3_2.jpg" },
                        { path: "static/pictures/2020/edition3_3.jpg" },
                    ]}
                />
                <div style={{ float: "right", paddingBottom: "20px"}}>
                    <b> Hugo Bis </b>
                </div>
            </div>
        );
    }
}

export default HistoryPage;
