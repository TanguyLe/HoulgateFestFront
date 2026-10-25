// Past editions, most recent first. Add the previous year here when a new edition starts.
const photos = (year, edition) =>
    [1, 2, 3].map((i) => `/static/pictures/${year}/edition${edition}_${i}.jpg`);

export const EDITIONS = [
    {
        year: 2024,
        title: "SoundgateFest",
        dates: "31 mai → 2 juin",
        banner: "/static/banners/2024.jpg",
        photos: photos(2024, 7),
        paragraphs: [
            "2024, c’est déjà 12 ans depuis la fin du monde des Mayas ! Et pourtant, les houlgatefestois ont bien festé, une fois de plus dans ce week-end de dinguos ! Au programme de cette édition, la musique à l’honneur ! Et quand la musique est bonne, bonne bonne la fête est bonne bonne bonne ! Parole du Didier Snake.",
            "Les duos et solos ont rivalisés de talent sur la piste pour nous présenter des chansons qui ont atterries droit dans nos cœurs #commeuneflèche lors du merveilleux HoulgateVoice. Les oreilles ravies, ce sont les papilles qui ont désormais pu l’être grâce à une dégustation de frometon pas piquée des hannetons.",
            "Enfin, comment ne pas les louer (eeh-eh-eeh-eh-eh), les fameux quizz et restaurant du samedi soir (joyeux anniversaire Tanguy !) ont réunis les convives de SoundgateFest et les ont mis en Y 👆🏼☝🏼",
        ],
    },
    {
        year: 2023,
        title: "Schtroumpfgatefest",
        dates: "9 → 11 juin",
        banner: "/static/banners/2023.jpg",
        winner: "Le RaphaSchtroumpf",
        photos: photos(2023, 6),
        paragraphs: [
            "Aaah 2023, mes aïeux quelle époque ! La schtroumpferie a battu son plein lors d'un week-end full diableries, où nos amis les Schtroumpfs ont pu jouer à Qui-Est-ce, manger des Schtroumpfgaufres et se restaurer de bonnes Schtroumpfpizzas.",
            "Les gagnants du fameux « Où sont les Schtroumpfs » ont pu se régaler et ramener chez eux une preuve de leur participation... Ce n'est pas tout ! Alléchés par l'odeur du piment fortifié, les Schtroumpfs se sont frottés à l'échelle de Schtroumpfville, et comme disait le Schtroumpf Naps, « C'était la piquance ! ».",
            "Enfin, des mélanges plus improbables les uns que les autres ont eu raison des plus vaillants d'entre nous. Pour ces premiers jeux individuels, c'est le RaphaSchtroumpf qui l'a emporté grâce à toute la pugnacité qui caractérise le Bébé Schtroumpf !",
        ],
    },
    {
        year: 2022,
        title: "Les Visit'heures 2 : l’APÉRO !",
        dates: "10 → 12 juin",
        banner: "/static/banners/2022.jpg",
        link: "https://www.facebook.com/events/996521040904216/",
        winner: "Les paysans",
        photos: photos(2022, 5),
        paragraphs: [
            "L’édition 2022 fut particulière ! En effet, elle n’a pas eu lieu à Houlgate ! Eh non… Mais qu’à cela ne tienne ! À conditions exceptionnelles, événement exceptionnel ! Le Houlgatefest se retire et laisse place aux Visit'heures 2 : l’APÉRO !",
            "Le principe ? Deux jours de banquet, trois tribus, des défis, des jeux, de la musique et surtout de la bonne humeur !",
            "Cette année, les nobles, le clergé et les paysans (berk !) s’affrontaient pour ramener le plus de moula à la maison ! Des scènes d’une rare violence ont pu être observées au cours de ce week-end. Les participants ont poussé leur corps au bout de leurs limites. Mais toujours dans la bonne humeur hein ?! Et ce sont finalement les paysans qui ont raflé le plus thunasses pour gagner ce spin-off 2022 ! Bravo à eux !",
        ],
    },
    {
        year: 2021,
        title: "HoulgateFest et la Gavle de Bois",
        dates: "11 → 13 juin",
        banner: "/static/banners/2021.jpg",
        link: "https://www.facebook.com/events/773462923524929",
        winner: "Les Romaintiques",
        photos: photos(2021, 4),
        paragraphs: [
            "Pour cette année, ce sont trois tribus qui se sont affrontées pour revendiquer la souveraineté du domaine ! Au programme, combat de chefs, défis relevés, concerts de bardes, shifumi et concours de pets !",
            "Et malgré leurs différences, les participants ont su mettre de côté leurs tensions et faire régner la joie de vivre tout au long du week-end !",
            "Mais bon, comme on n’est pas là pour enfiler des perles, il faut bien un gagnant ! Et c’est la tribu des Romaintiques qui a remporté cette édition 2021 ! On les félicite… Ou pas.",
        ],
    },
    {
        year: 2020,
        title: "HoulgateFest et la Coupe de F",
        dates: "25 → 27 septembre",
        banner: "/static/banners/2020.jpg",
        link: "https://www.facebook.com/events/1263546553855244/",
        winner: "Serpentard",
        photos: photos(2020, 3),
        paragraphs: [
            "Édition initialement prévue le weekend du 26 juin 2020 mais repoussée cause Covid.",
            "Cette année, Houlgate se transforme en Poulgate et les différents participants sont répartis dans quatre maisons de sorciers.",
            "L’objectif étant d’accumuler les points lors de quiz, jeux et défis afin de faire gagner sa maison. Une fois n’est pas coutume, ce sont les Serpentards qui ramenèrent la coupe à la maison.",
        ],
    },
    {
        year: 2019,
        title: "HoulgateFest Le Retour",
        dates: "27 → 29 juin",
        banner: "/static/banners/2019.jpg",
        link: "https://www.facebook.com/events/420496642092857/",
        winner: "Team Tirajosaure",
        photos: photos(2019, 2),
        paragraphs: [
            "Un an plus tard, la fiesta est de retour à Houlgate. La passion de l’alcool est toujours présente et se voit même renforcée avec la dégustation de la fameuse bière artisanale « Délivrez-nous du Malt ».",
            "Première compétition également : les Olympiadasses !",
            "Deux équipes s’affrontent tout au long du weekend. Ce sera finalement la Team Tirajosaure qui prendra le meilleur sur la Team Sir Concis.",
        ],
    },
    {
        year: 2018,
        title: "Naissance du HoulgateFest",
        dates: "8 → 10 juin",
        banner: "/static/banners/2018.jpg",
        link: "https://www.facebook.com/events/412313352536608/",
        photos: photos(2018, 1),
        paragraphs: [
            "Les pionniers de la nouba normande investissent Houlgate le temps d’un weekend. Les survivants décrivent encore aujourd’hui un état d’esprit commun à toutes les personnes présentes sur place en 2018 : une passion non dissimulée pour le houblon, les spiritueux et la boisson bien distillée en général.",
            "Aucune trace de compétition. Le shotgun sur le site échoue lamentablement.",
            "Passage remarqué et remarquable de cette joyeuse équipée au Royalty, établissement culinaire (ayant dû fermer pour 6 mois de travaux et près de 14 plaintes de la Mairie et des riverains suite à cet événement).",
        ],
    },
];
