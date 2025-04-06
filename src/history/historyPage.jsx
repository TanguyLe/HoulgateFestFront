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
                    <Header.Content>2024: SoundgateFest ! (31 mai au 2 juin)</Header.Content>
                </Header>
                <div style={{ float: "left" }}>
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        src="static/banners/2024.jpg"
                        size="medium"
                        floated="left"
                        bordered
                        spaced
                    />
                    <p>
                        2024, c’est déjà 12 ans depuis la fin du monde des Mayas !
                        Et pourtant, les houlgatefestois ont bien festés, 
                        une fois de plus dans ce week-end de dinguos !
                        Au programme de cette édition, la musique à l’honneur !
                        Et quand la musique est bonne, bonne bonne la fête est bonne bonne bonne !
                        Parole du Didier Snake
                    </p>
                    <p>
                        Les duos et solos ont rivalisés de talent sur la piste pour nous présenter 
                        des chansons qui ont atterries droits dans nos cœurs #commeuneflèche lors 
                        du merveilleux HoulgateVoice. Les oreilles ravies, ce sont les papilles qui 
                        ont désormais pu l’être grâce à une dégustation de frometon pas piquée des hannetons.
                    </p>
                    <p>
                        Enfin, comment ne pas les louer (eeh-eh-eeh-eh-eh), les fameux quizz et restaurant 
                        du samedi soir (joyeux anniversaire Tanguy !) ont réunis les convives de SoundgateFest 
                        et les ont mis en Y 👆🏼☝🏼
                    </p>
                </div>
                <br />
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2023/edition7_1.jpg" },
                        { path: "static/pictures/2023/edition7_2.jpg" },
                        { path: "static/pictures/2023/edition7_3.jpg" },
                    ]}
                />
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>2023: Schtroumpfgatefest ! (9 au 11 Juin)</Header.Content>
                </Header>
                <div style={{ float: "left" }}>
                    <Image
                        style={{ margin: "10px 10px 10px 10px" }}
                        src="static/banners/2023.jpg"
                        size="medium"
                        floated="left"
                        bordered
                        spaced
                    />
                    <p>
                        Aaah 2023, mes aïeux quelle époque ! La schtroumpferie a battu son plein
                        lors d'un week-end full diableries, où nos amis les Schtroumpfs ont pu jouer
                        à Qui-Est-ce, manger des Schtroumpfgaufres et se restaurer de bonnes
                        Schtroumpfpizzas.
                    </p>
                    <p>
                        Les gagnants du fameux "Où sont les Schtroumpfs" ont pu se régaler et
                        ramener chez eux une preuve de leur participation... Ce n'est pas tout !
                        Alléchés par l'odeur du piment fortifié, les Schtroumpfs se sont frottés à
                        l'échelle de Schtroumpfville, et comme disait le Schtroumpf Naps, "C'était
                        la piquance !".
                    </p>
                    <p>
                        Enfin, des mélanges plus improbables les uns que les autres ont eu raison
                        des plus vaillants d'entre nous. Pour ces premiers jeux individuels, c'est
                        le RaphaSchtroumpf qui l'a emporté grâce à toute la pugnacité qui
                        caractérise le Bébé Schtroumpf !
                    </p>
                </div>
                <br />
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2023/edition6_1.jpg" },
                        { path: "static/pictures/2023/edition6_2.jpg" },
                        { path: "static/pictures/2023/edition6_3.jpg" },
                    ]}
                />
                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>
                        <a href="https://www.facebook.com/events/996521040904216/" target="_blank">
                            2022: Les Visit'heures 2 : l’APÉRO ! (10 au 12 Juin)
                        </a>
                    </Header.Content>
                </Header>
                <Image
                    style={{ paddingBottom: "10px" }}
                    src="static/banners/2022.jpg"
                    centered
                    spaced
                />

                <p>
                    L’édition 2022 fut particulière ! En effet, elle n’a pas eu lieu à Houlgate ! Eh
                    non… Mais qu’à cela ne tienne ! À conditions exceptionnelles, événement
                    exceptionnel ! Le Houlgatefest se retire et laisse place aux Visit'heures 2 :
                    l’APÉRO !
                </p>
                <p>
                    Le principe ? Deux jours de banquet, trois tribus, des défis, des jeux, de la
                    musique et surtout de la bonne humeur !
                </p>
                <p>
                    Cette année, les nobles, le clergé et les paysans (berk !) s’affrontaient pour
                    ramener le plus de moula à la maison ! Des scènes d’une rare violence ont pu
                    être observées au cours de ce week-end. Les participants ont poussé leur corps
                    au bout de leurs limites. Mais toujours dans la bonne humeur hein ?! Et ce sont
                    finalement les paysans qui ont raflé le plus thunasses pour gagner ce spin-off
                    2022 ! Bravo à eux !
                </p>
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2022/edition5_1.jpg" },
                        { path: "static/pictures/2022/edition5_2.jpg" },
                        { path: "static/pictures/2022/edition5_3.jpg" },
                    ]}
                />

                <Header as="h3">
                    <Icon name="heart" />
                    <Header.Content>
                        <a href="https://www.facebook.com/events/773462923524929" target="_blank">
                            2021: HoulgateFest et la Gavle de Bois (11 au 13 Juin)
                        </a>
                    </Header.Content>
                </Header>
                <Image
                    style={{ paddingBottom: "10px" }}
                    src="static/banners/2021.jpg"
                    centered
                    spaced
                />

                <p>
                    Pour cette année, ce sont trois tribus qui se sont affrontées pour revendiquer
                    la souveraineté du domaine ! Au programme, combat de chefs, défis relevés,
                    concerts de bardes, shifumi et concours de pets !
                </p>
                <p>
                    Et malgré leurs différences, les participants ont su mettre de côté leurs
                    tensions et faire régner la joie de vivre tout au long du week-end !
                </p>
                <p>
                    Mais bon, comme on n’est pas là pour enfiler des perles, il faut bien un gagnant
                    ! Et c’est la tribu des Romaintiques qui a remporté cette édition 2021 ! On les
                    félicite… Ou pas.
                </p>
                <ImagesCarousel
                    images={[
                        { path: "static/pictures/2021/edition4_1.jpg" },
                        { path: "static/pictures/2021/edition4_2.jpg" },
                        { path: "static/pictures/2021/edition4_3.jpg" },
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
                <div style={{ float: "right", paddingBottom: "20px" }}>
                    <b> Hugo Bis & Raphoune </b>
                </div>
            </div>
        );
    }
}

export default HistoryPage;
