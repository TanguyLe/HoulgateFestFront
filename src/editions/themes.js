// Front-side identity of each edition: name, colors, poster and texts.
// The dates of the current edition come from the API (GET /edition?current=true), not from here.
//
// - posterLines: the name split for the giant display type of the homepage
// - accent / accentInk: the loud color of the edition and the text color readable on it
// - home: texts of the homepage while the edition is the current one
// - story / pictures: its page in the Gloryhoul of Fame, once it is over

const pictures = (year, edition) =>
    [1, 2, 3].map((index) => `/static/pictures/${year}/edition${edition}_${index}.jpg`);

export const THEMES = {
    2025: {
        year: 2025,
        name: "DoublegateFest",
        posterLines: ["Double", "gate", "Fest"],
        tagline: "Le Duo Choc",
        when: "20 au 22 juin",
        accent: "#ff3b1f",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2025.jpg",
        home: {
            headline: "DoublegateFest met l’alchimie à l’honneur\u00a0!",
            intro: [
                "Dans un monde où les contrastes s'harmonisent, l'heure est venue de célébrer le \"Duo Choc\" ! Une rencontre explosive entre deux esprits, deux talents, deux univers qui s'unissent pour créer une alliance sans pareille.",
                "Que ce soit à travers la musique, le cinéma ou la gastronomie, laissez-vous emporter par cette magie qui se produit lorsque les opposés s'attirent.",
                "Préparez-vous à une soirée inoubliable, où chaque duo apportera son propre éclat à notre fête colorée ! Nos duos vont donc s’affronter dans des jeux variés pour faire rayonner sur Houlgate leurs personnalités flamboyantes et repartir, qui sait… avec un cadeau probablement exceptionnel !",
                "Tenterez-vous l’aventure ?",
            ],
            bed: "Comme dit plus haut, tous nos duos sont attendus avec impatience à Houlgate, qu’ils viennent du passé ou de votre assiette ! Cependant, seul votre lit est à réserver sur ce site !",
            extra: [
                "Les moins réactifs pourront aussi apporter leurs plus belles toiles de tente et leurs meilleurs costumes de duo ! Après tout, la surprise fait toujours son effet. Sinon, vous pourrez toujours refaire le monde autour du feu en brûlant vos fausses moustaches, parce que vous avez toujours été imberbe !",
            ],
            hashtag: "#PosticheMoustachu",
            news: "Pour être notifié directement au moment du Shotgun et au courant de toutes les actualités du DoublegateFest : rendez-vous sur le groupe WhatsApp de l’évènement !",
            gallery: [
                { src: "/static/carrousel1.jpg", caption: "Image générée par IA n°1" },
                { src: "/static/carrousel2.jpg", caption: "Image générée par IA n°2" },
                { src: "/static/carrousel3.jpg", caption: "Image générée par IA n°3" },
            ],
            signature: "Les orgas",
        },
    },
    2024: {
        year: 2024,
        name: "SoundgateFest",
        posterLines: ["Sound", "gate", "Fest"],
        tagline: "La musique à l’honneur",
        when: "31 mai au 2 juin",
        accent: "#c6ff00",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2024.jpg",
        pictures: pictures(2024, 7),
        story: [
            "2024, c’est déjà 12 ans depuis la fin du monde des Mayas ! Et pourtant, les houlgatefestois ont bien festé, une fois de plus dans ce week-end de dinguos ! Au programme de cette édition, la musique à l’honneur ! Et quand la musique est bonne, bonne bonne la fête est bonne bonne bonne ! Parole du Didier Snake.",
            "Les duos et solos ont rivalisés de talent sur la piste pour nous présenter des chansons qui ont atterries droit dans nos cœurs #commeuneflèche lors du merveilleux HoulgateVoice. Les oreilles ravies, ce sont les papilles qui ont désormais pu l’être grâce à une dégustation de frometon pas piquée des hannetons.",
            "Enfin, comment ne pas les louer (eeh-eh-eeh-eh-eh), les fameux quizz et restaurant du samedi soir (joyeux anniversaire Tanguy !) ont réunis les convives de SoundgateFest et les ont mis en Y 👆🏼☝🏼",
        ],
    },
    2023: {
        year: 2023,
        name: "Schtroumpfgatefest",
        posterLines: ["Schtroumpf", "gate", "Fest"],
        tagline: "La schtroumpferie a battu son plein",
        when: "9 au 11 juin",
        accent: "#3d8bff",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2023.jpg",
        pictures: pictures(2023, 6),
        story: [
            "Aaah 2023, mes aïeux quelle époque ! La schtroumpferie a battu son plein lors d'un week-end full diableries, où nos amis les Schtroumpfs ont pu jouer à Qui-Est-ce, manger des Schtroumpfgaufres et se restaurer de bonnes Schtroumpfpizzas.",
            "Les gagnants du fameux \"Où sont les Schtroumpfs\" ont pu se régaler et ramener chez eux une preuve de leur participation... Ce n'est pas tout ! Alléchés par l'odeur du piment fortifié, les Schtroumpfs se sont frottés à l'échelle de Schtroumpfville, et comme disait le Schtroumpf Naps, \"C'était la piquance !\".",
            "Enfin, des mélanges plus improbables les uns que les autres ont eu raison des plus vaillants d'entre nous. Pour ces premiers jeux individuels, c'est le RaphaSchtroumpf qui l'a emporté grâce à toute la pugnacité qui caractérise le Bébé Schtroumpf !",
        ],
    },
    2022: {
        year: 2022,
        name: "Les Visit'heures 2 : l’APÉRO !",
        posterLines: ["Visit'", "heures 2"],
        tagline: "L’APÉRO !",
        when: "10 au 12 juin",
        accent: "#b44dff",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2022.jpg",
        link: "https://www.facebook.com/events/996521040904216/",
        pictures: pictures(2022, 5),
        story: [
            "L’édition 2022 fut particulière ! En effet, elle n’a pas eu lieu à Houlgate ! Eh non… Mais qu’à cela ne tienne ! À conditions exceptionnelles, événement exceptionnel ! Le Houlgatefest se retire et laisse place aux Visit'heures 2 : l’APÉRO !",
            "Le principe ? Deux jours de banquet, trois tribus, des défis, des jeux, de la musique et surtout de la bonne humeur !",
            "Cette année, les nobles, le clergé et les paysans (berk !) s’affrontaient pour ramener le plus de moula à la maison ! Des scènes d’une rare violence ont pu être observées au cours de ce week-end. Les participants ont poussé leur corps au bout de leurs limites. Mais toujours dans la bonne humeur hein ?! Et ce sont finalement les paysans qui ont raflé le plus thunasses pour gagner ce spin-off 2022 ! Bravo à eux !",
        ],
    },
    2021: {
        year: 2021,
        name: "HoulgateFest et la Gavle de Bois",
        posterLines: ["Gavle", "de Bois"],
        tagline: "Trois tribus pour un domaine",
        when: "11 au 13 juin",
        accent: "#ff9f1c",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2021.jpg",
        link: "https://www.facebook.com/events/773462923524929",
        pictures: pictures(2021, 4),
        story: [
            "Pour cette année, ce sont trois tribus qui se sont affrontées pour revendiquer la souveraineté du domaine ! Au programme, combat de chefs, défis relevés, concerts de bardes, shifumi et concours de pets !",
            "Et malgré leurs différences, les participants ont su mettre de côté leurs tensions et faire régner la joie de vivre tout au long du week-end !",
            "Mais bon, comme on n’est pas là pour enfiler des perles, il faut bien un gagnant ! Et c’est la tribu des Romaintiques qui a remporté cette édition 2021 ! On les félicite… Ou pas.",
        ],
    },
    2020: {
        year: 2020,
        name: "HoulgateFest et la Coupe de F",
        posterLines: ["Coupe", "de F"],
        tagline: "Houlgate se transforme en Poulgate",
        when: "25 au 27 septembre",
        accent: "#00c46a",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2020.jpg",
        link: "https://www.facebook.com/events/1263546553855244/",
        pictures: pictures(2020, 3),
        story: [
            "Édition initialement prévue le weekend du 26 juin 2020 mais repoussée cause Covid.",
            "Cette année, Houlgate se transforme en Poulgate et les différents participants sont répartis dans quatre maisons de sorciers.",
            "L’objectif étant d’accumuler les points lors de quiz, jeux et défis afin de faire gagner sa maison. Une fois n’est pas coutume, ce sont les Serpentards qui ramenèrent la coupe à la maison.",
        ],
    },
    2019: {
        year: 2019,
        name: "HoulgateFest Le Retour",
        posterLines: ["Le", "Retour"],
        tagline: "Première compétition : les Olympiadasses",
        when: "27 au 29 juin",
        accent: "#ffe600",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2019.jpg",
        link: "https://www.facebook.com/events/420496642092857/",
        pictures: pictures(2019, 2),
        story: [
            "Un an plus tard, la fiesta est de retour à Houlgate. La passion de l’alcool est toujours présente et se voit même renforcée avec la dégustation de la fameuse bière artisanale “Délivrez-nous du Malt”.",
            "Première compétition également: les Olympiadasses !",
            "Deux équipes s’affrontent tout au long du weekend. Ce sera finalement la Team Tirajosaure qui prendra le meilleur sur la Team Sir Concis.",
        ],
    },
    2018: {
        year: 2018,
        name: "Naissance du HoulgateFest",
        posterLines: ["Nais-", "sance"],
        tagline: "Les pionniers de la nouba normande",
        when: "8 au 10 juin",
        accent: "#00e5ff",
        accentInk: "#0a0a0a",
        banner: "/static/banners/2018.jpg",
        link: "https://www.facebook.com/events/412313352536608/",
        pictures: pictures(2018, 1),
        story: [
            "Les pionniers de la nouba normande investissent Houlgate le temps d’un weekend. Les survivants décrivent encore aujourd’hui un état d’esprit commun à toutes les personnes présentes sur place en 2018: une passion non dissimulée pour le houblon, les spiritueux et la boisson bien distillée en général.",
            "Aucune trace de compétition. Le shotgun sur le site échoue lamentablement.",
            "Passage remarqué et remarquable de cette joyeuse équipée au Royalty, établissement culinaire (ayant dû fermer pour 6 mois de travaux et près de 14 plaintes de la Mairie et des riverains suite à cet événement).",
        ],
    },
};

export const LATEST_THEME_YEAR = Math.max(...Object.keys(THEMES).map(Number));

export const HISTORY_SIGNATURE = "Hugo Bis & Raphoune";

// An edition without its theme yet (e.g. the admin created next year's one): stays readable
export const getFallbackTheme = (year) => ({
    year: year,
    name: "HoulgateFest " + year,
    posterLines: ["Houlgate", "Fest", String(year)],
    tagline: "Le thème arrive bientôt…",
    accent: "#ff4d00",
    accentInk: "#0a0a0a",
    banner: null,
    fallback: true,
    home: {
        headline: "Bienvenue sur le site d'HoulgateFest !",
        intro: [
            "Le thème de cette édition est encore un secret bien gardé par les orgas. Patience !",
        ],
        signature: "Les orgas",
    },
});

export const getTheme = (year) => {
    if (year && THEMES[year]) return THEMES[year];
    if (year) return getFallbackTheme(year);
    return THEMES[LATEST_THEME_YEAR];
};

// The editions of the Gloryhoul of Fame: those with a story, latest first
export const getArchive = () =>
    Object.values(THEMES)
        .filter((theme) => theme.story)
        .sort((a, b) => b.year - a.year);
