/*
 * Front-side configuration of every edition: its name, its colors, its banner and its texts.
 * The dates come from the API (GET /edition?current=true), only the labels used when they're
 * unknown are written here.
 *
 * To add an edition: copy the latest one, change the year, the texts, the colors and the banner
 * (web/static/banners/<year>.jpg). The history page shows every edition having a `story`.
 *
 * - colors.accent must stay readable as a background behind white text (contrast >= 4.5)
 * - colors.gradient are the 3 decorative colors of the invite card
 */

export const SHOTGUN_GUIDE_LINK =
    "https://docs.google.com/document/d/19Yfhg8whi_AQRPlVCqYRUmmdQwRggpVxn1tbaPKCMkc/edit?usp=sharing";

const THEMES = {
    2025: {
        name: "DoublegateFest",
        subtitle: "le Duo Choc",
        tagline: "DoublegateFest met l’alchimie à l’honneur !",
        emoji: "👯",
        sticker: "Duo Choc",
        banner: "/static/banners/2025.jpg",
        colors: {
            accent: "#c7365f",
            soft: "#ffe6ee",
            gradient: ["#ffc94a", "#ff7a59", "#e84a8a"],
        },
        datesLabel: "du 20/06/2025 au 22/06/2025",
        shotgunLabel: "le 1er juin à 20h",
        intro: [
            "Dans un monde où les contrastes s'harmonisent, l'heure est venue de célébrer le \"Duo Choc\" ! Une rencontre explosive entre deux esprits, deux talents, deux univers qui s'unissent pour créer une alliance sans pareille.",
            "Que ce soit à travers la musique, le cinéma ou la gastronomie, laissez-vous emporter par cette magie qui se produit lorsque les opposés s'attirent.",
            "Préparez-vous à une soirée inoubliable, où chaque duo apportera son propre éclat à notre fête colorée ! Nos duos vont donc s’affronter dans des jeux variés pour faire rayonner sur Houlgate leurs personnalités flamboyantes et repartir, qui sait… avec un cadeau probablement exceptionnel !",
        ],
        question: "Tenterez-vous l’aventure ?",
        bedNote:
            "Comme dit plus haut, tous nos duos sont attendus avec impatience à Houlgate, qu’ils viennent du passé ou de votre assiette ! Cependant, seul votre lit est à réserver sur ce site !",
        latecomers:
            "Les moins réactifs pourront aussi apporter leurs plus belles toiles de tente et leurs meilleurs costumes de duo ! Après tout, la surprise fait toujours son effet. Sinon, vous pourrez toujours refaire le monde autour du feu en brûlant vos fausses moustaches, parce que vous avez toujours été imberbe ! #PosticheMoustachu",
        stayTuned:
            "Pour être notifié directement au moment du Shotgun et au courant de toutes les actualités du DoublegateFest : rendez-vous sur le groupe WhatsApp de l’évènement !",
        images: [
            { src: "/static/carrousel1.jpg", caption: "Image générée par IA n°1" },
            { src: "/static/carrousel2.jpg", caption: "Image générée par IA n°2" },
            { src: "/static/carrousel3.jpg", caption: "Image générée par IA n°3" },
        ],
        signature: "Les orgas",
    },
    2024: {
        name: "SoundgateFest",
        emoji: "🎤",
        sticker: "HoulgateVoice",
        banner: "/static/banners/2024.jpg",
        colors: { accent: "#c2410c", soft: "#ffedd5", gradient: ["#ffb347", "#ff6a3d", "#ff3d7f"] },
        datesLabel: "31 mai au 2 juin",
        story: [
            "2024, c’est déjà 12 ans depuis la fin du monde des Mayas ! Et pourtant, les houlgatefestois ont bien festé, une fois de plus dans ce week-end de dinguos ! Au programme de cette édition, la musique à l’honneur ! Et quand la musique est bonne, bonne bonne la fête est bonne bonne bonne ! Parole du Didier Snake.",
            "Les duos et solos ont rivalisés de talent sur la piste pour nous présenter des chansons qui ont atterries droit dans nos cœurs #commeuneflèche lors du merveilleux HoulgateVoice. Les oreilles ravies, ce sont les papilles qui ont désormais pu l’être grâce à une dégustation de frometon pas piquée des hannetons.",
            "Enfin, comment ne pas les louer (eeh-eh-eeh-eh-eh), les fameux quizz et restaurant du samedi soir (joyeux anniversaire Tanguy !) ont réunis les convives de SoundgateFest et les ont mis en Y 👆🏼☝🏼",
        ],
        photos: [
            "/static/pictures/2024/edition7_1.jpg",
            "/static/pictures/2024/edition7_2.jpg",
            "/static/pictures/2024/edition7_3.jpg",
        ],
    },
    2023: {
        name: "Schtroumpfgatefest",
        emoji: "🍄",
        sticker: "C'était la piquance !",
        banner: "/static/banners/2023.jpg",
        colors: { accent: "#1d63c9", soft: "#e0edff", gradient: ["#7fd3ff", "#3d8bff", "#2f5bd8"] },
        datesLabel: "9 au 11 juin",
        story: [
            "Aaah 2023, mes aïeux quelle époque ! La schtroumpferie a battu son plein lors d'un week-end full diableries, où nos amis les Schtroumpfs ont pu jouer à Qui-Est-ce, manger des Schtroumpfgaufres et se restaurer de bonnes Schtroumpfpizzas.",
            "Les gagnants du fameux \"Où sont les Schtroumpfs\" ont pu se régaler et ramener chez eux une preuve de leur participation... Ce n'est pas tout ! Alléchés par l'odeur du piment fortifié, les Schtroumpfs se sont frottés à l'échelle de Schtroumpfville, et comme disait le Schtroumpf Naps, \"C'était la piquance !\".",
            "Enfin, des mélanges plus improbables les uns que les autres ont eu raison des plus vaillants d'entre nous. Pour ces premiers jeux individuels, c'est le RaphaSchtroumpf qui l'a emporté grâce à toute la pugnacité qui caractérise le Bébé Schtroumpf !",
        ],
        photos: [
            "/static/pictures/2023/edition6_1.jpg",
            "/static/pictures/2023/edition6_2.jpg",
            "/static/pictures/2023/edition6_3.jpg",
        ],
    },
    2022: {
        name: "Les Visit'heures 2 : l’APÉRO !",
        emoji: "🥂",
        sticker: "Spin-off",
        banner: "/static/banners/2022.jpg",
        colors: { accent: "#9a4d0f", soft: "#fdf0dc", gradient: ["#f7d774", "#e9a23b", "#b5651d"] },
        datesLabel: "10 au 12 juin",
        link: "https://www.facebook.com/events/996521040904216/",
        story: [
            "L’édition 2022 fut particulière ! En effet, elle n’a pas eu lieu à Houlgate ! Eh non… Mais qu’à cela ne tienne ! À conditions exceptionnelles, événement exceptionnel ! Le Houlgatefest se retire et laisse place aux Visit'heures 2 : l’APÉRO !",
            "Le principe ? Deux jours de banquet, trois tribus, des défis, des jeux, de la musique et surtout de la bonne humeur !",
            "Cette année, les nobles, le clergé et les paysans (berk !) s’affrontaient pour ramener le plus de moula à la maison ! Des scènes d’une rare violence ont pu être observées au cours de ce week-end. Les participants ont poussé leur corps au bout de leurs limites. Mais toujours dans la bonne humeur hein ?! Et ce sont finalement les paysans qui ont raflé le plus thunasses pour gagner ce spin-off 2022 ! Bravo à eux !",
        ],
        photos: [
            "/static/pictures/2022/edition5_1.jpg",
            "/static/pictures/2022/edition5_2.jpg",
            "/static/pictures/2022/edition5_3.jpg",
        ],
    },
    2021: {
        name: "HoulgateFest et la Gavle de Bois",
        emoji: "🛡️",
        sticker: "Trois tribus",
        banner: "/static/banners/2021.jpg",
        colors: { accent: "#2e7d32", soft: "#e3f4e1", gradient: ["#c5e86c", "#5fb85a", "#2e7d32"] },
        datesLabel: "11 au 13 juin",
        link: "https://www.facebook.com/events/773462923524929",
        story: [
            "Pour cette année, ce sont trois tribus qui se sont affrontées pour revendiquer la souveraineté du domaine ! Au programme, combat de chefs, défis relevés, concerts de bardes, shifumi et concours de pets !",
            "Et malgré leurs différences, les participants ont su mettre de côté leurs tensions et faire régner la joie de vivre tout au long du week-end !",
            "Mais bon, comme on n’est pas là pour enfiler des perles, il faut bien un gagnant ! Et c’est la tribu des Romaintiques qui a remporté cette édition 2021 ! On les félicite… Ou pas.",
        ],
        photos: [
            "/static/pictures/2021/edition4_1.jpg",
            "/static/pictures/2021/edition4_2.jpg",
            "/static/pictures/2021/edition4_3.jpg",
        ],
    },
    2020: {
        name: "HoulgateFest et la Coupe de F",
        emoji: "🧙",
        sticker: "Poulgate",
        banner: "/static/banners/2020.jpg",
        colors: { accent: "#5b2c83", soft: "#efe4fa", gradient: ["#f2c14e", "#a05bd6", "#5b2c83"] },
        datesLabel: "25 au 27 septembre",
        link: "https://www.facebook.com/events/1263546553855244/",
        story: [
            "Édition initialement prévue le weekend du 26 juin 2020 mais repoussée cause Covid.",
            "Cette année, Houlgate se transforme en Poulgate et les différents participants sont répartis dans quatre maisons de sorciers.",
            "L’objectif étant d’accumuler les points lors de quiz, jeux et défis afin de faire gagner sa maison. Une fois n’est pas coutume, ce sont les Serpentards qui ramenèrent la coupe à la maison.",
        ],
        photos: [
            "/static/pictures/2020/edition3_1.jpg",
            "/static/pictures/2020/edition3_2.jpg",
            "/static/pictures/2020/edition3_3.jpg",
        ],
    },
    2019: {
        name: "HoulgateFest Le Retour",
        emoji: "🍺",
        sticker: "Olympiadasses",
        banner: "/static/banners/2019.jpg",
        colors: { accent: "#b45309", soft: "#fff1d6", gradient: ["#ffe08a", "#fbbf24", "#d97706"] },
        datesLabel: "27 au 29 juin",
        link: "https://www.facebook.com/events/420496642092857/",
        story: [
            "Un an plus tard, la fiesta est de retour à Houlgate. La passion de l’alcool est toujours présente et se voit même renforcée avec la dégustation de la fameuse bière artisanale “Délivrez-nous du Malt”.",
            "Première compétition également: les Olympiadasses !",
            "Deux équipes s’affrontent tout au long du weekend. Ce sera finalement la Team Tirajosaure qui prendra le meilleur sur la Team Sir Concis.",
        ],
        photos: [
            "/static/pictures/2019/edition2_1.jpg",
            "/static/pictures/2019/edition2_2.jpg",
            "/static/pictures/2019/edition2_3.jpg",
        ],
    },
    2018: {
        name: "Naissance du HoulgateFest",
        emoji: "🐣",
        sticker: "La toute première",
        banner: "/static/banners/2018.jpg",
        colors: { accent: "#0369a1", soft: "#e0f2fe", gradient: ["#a5f3fc", "#38bdf8", "#0284c7"] },
        datesLabel: "8 au 10 juin",
        link: "https://www.facebook.com/events/412313352536608/",
        story: [
            "Les pionniers de la nouba normande investissent Houlgate le temps d’un weekend. Les survivants décrivent encore aujourd’hui un état d’esprit commun à toutes les personnes présentes sur place en 2018: une passion non dissimulée pour le houblon, les spiritueux et la boisson bien distillée en général.",
            "Aucune trace de compétition. Le shotgun sur le site échoue lamentablement.",
            "Passage remarqué et remarquable de cette joyeuse équipée au Royalty, établissement culinaire (ayant dû fermer pour 6 mois de travaux et près de 14 plaintes de la Mairie et des riverains suite à cet événement).",
        ],
        photos: [
            "/static/pictures/2018/edition1_1.jpg",
            "/static/pictures/2018/edition1_2.jpg",
            "/static/pictures/2018/edition1_3.jpg",
        ],
    },
};

// The signature of the history page
export const HISTORY_SIGNATURE = "Hugo Bis & Raphoune";

export const LATEST_THEME_YEAR = Math.max(...Object.keys(THEMES).map(Number));

const FALLBACK_COLORS = {
    accent: "#6d4ae0",
    soft: "#ece7ff",
    gradient: ["#ffd166", "#ff6b9a", "#845ef7"],
};

// Used for a year without configuration: the theme is not revealed yet
const fallbackTheme = (year) => ({
    name: "HoulgateFest " + year,
    tagline: "Le thème est encore top secret 🤫",
    emoji: "🎉",
    sticker: "Thème mystère",
    banner: null,
    colors: FALLBACK_COLORS,
    intro: [
        "L'édition " +
            year +
            " se prépare en coulisses ! Le thème sera dévoilé bientôt : en attendant, crée ton compte et prépare-toi pour le shotgun.",
    ],
    images: [],
    signature: "Les orgas",
});

export const getTheme = (year) => {
    const theme = THEMES[year] || fallbackTheme(year);
    return Object.assign({ year: Number(year), images: [], intro: [] }, theme);
};

// Every configured edition, the most recent first
export const getAllThemes = () =>
    Object.keys(THEMES)
        .map(Number)
        .sort((a, b) => b - a)
        .map(getTheme);

// The CSS custom properties of a theme, to put in a `style` attribute
export const getThemeStyle = (theme) => ({
    "--c-accent": theme.colors.accent,
    "--c-accent-soft": theme.colors.soft,
    "--c-grad-1": theme.colors.gradient[0],
    "--c-grad-2": theme.colors.gradient[1],
    "--c-grad-3": theme.colors.gradient[2],
    // Redefined here: a custom property using others is computed where it's declared
    "--grad-edition":
        "linear-gradient(135deg, " +
        theme.colors.gradient[0] +
        ", " +
        theme.colors.gradient[1] +
        " 55%, " +
        theme.colors.gradient[2] +
        ")",
});
