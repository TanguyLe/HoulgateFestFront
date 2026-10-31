/*
 * One entry per edition: what makes each year look like its own poster.
 *
 * - name / subtitle / tagline: the hero titles
 * - dates: human readable dates, for the archive
 * - colors: accent (decoration, stripes), accentStrong (text & buttons, readable on white
 *   and under white text), accentSoft (tinted backgrounds)
 * - banner: the edition's poster, in web/static/banners
 * - intro: the pitch shown on the homepage before the weekend
 * - notes: edition specific practical notes for the homepage
 * - story: what happened, for the Gloryhoul of Fame
 * - photos: the edition's pictures, in web/static/pictures/<year>
 *
 * A year without an entry falls back on FALLBACK_THEME (see getTheme).
 */

const photos = (year, edition) =>
    [1, 2, 3].map((index) => `/static/pictures/${year}/edition${edition}_${index}.jpg`);

export const THEMES = {
    2025: {
        name: "DoublegateFest",
        subtitle: "Le Duo Choc",
        tagline: "DoublegateFest met l’alchimie à l’honneur !",
        dates: "20 au 22 juin",
        colors: { accent: "#e0902f", accentStrong: "#9c5410", accentSoft: "#fbe8c8" },
        banner: "/static/banners/2025.jpg",
        intro: [
            "Dans un monde où les contrastes s'harmonisent, l'heure est venue de célébrer le \"Duo Choc\" ! Une rencontre explosive entre deux esprits, deux talents, deux univers qui s'unissent pour créer une alliance sans pareille.",
            "Que ce soit à travers la musique, le cinéma ou la gastronomie, laissez-vous emporter par cette magie qui se produit lorsque les opposés s'attirent.",
            "Préparez-vous à une soirée inoubliable, où chaque duo apportera son propre éclat à notre fête colorée ! Nos duos vont donc s’affronter dans des jeux variés pour faire rayonner sur Houlgate leurs personnalités flamboyantes et repartir, qui sait… avec un cadeau probablement exceptionnel !",
            "Tenterez-vous l’aventure ?",
        ],
        notes: [
            "Tous nos duos sont attendus avec impatience à Houlgate, qu’ils viennent du passé ou de votre assiette ! Cependant, seul votre lit est à réserver sur ce site !",
            "Soyez présents le 1er juin à 20h sur cette plateforme pour choisir votre meilleur hamac !",
            "Les moins réactifs pourront aussi apporter leurs plus belles toiles de tente et leurs meilleurs costumes de duo ! Après tout, la surprise fait toujours son effet. Sinon, vous pourrez toujours refaire le monde autour du feu en brûlant vos fausses moustaches, parce que vous avez toujours été imberbe ! #PosticheMoustachu",
        ],
        illustrations: [
            { src: "/static/carrousel1.jpg", caption: "Image générée par IA n°1" },
            { src: "/static/carrousel2.jpg", caption: "Image générée par IA n°2" },
            { src: "/static/carrousel3.jpg", caption: "Image générée par IA n°3" },
        ],
        signature: "Les orgas",
        photos: [],
    },
    2024: {
        name: "SoundgateFest",
        subtitle: "La musique à l’honneur",
        tagline: "Quand la musique est bonne, bonne bonne, la fête est bonne bonne bonne !",
        dates: "31 mai au 2 juin",
        colors: { accent: "#d2553a", accentStrong: "#a63a22", accentSoft: "#f9dfd6" },
        banner: "/static/banners/2024.jpg",
        story: [
            "2024, c’est déjà 12 ans depuis la fin du monde des Mayas ! Et pourtant, les houlgatefestois ont bien festé, une fois de plus dans ce week-end de dinguos ! Au programme de cette édition, la musique à l’honneur ! Et quand la musique est bonne, bonne bonne la fête est bonne bonne bonne ! Parole du Didier Snake.",
            "Les duos et solos ont rivalisés de talent sur la piste pour nous présenter des chansons qui ont atterries droit dans nos cœurs #commeuneflèche lors du merveilleux HoulgateVoice. Les oreilles ravies, ce sont les papilles qui ont désormais pu l’être grâce à une dégustation de frometon pas piquée des hannetons.",
            "Enfin, comment ne pas les louer (eeh-eh-eeh-eh-eh), les fameux quizz et restaurant du samedi soir (joyeux anniversaire Tanguy !) ont réunis les convives de SoundgateFest et les ont mis en Y 👆🏼☝🏼",
        ],
        photos: photos(2024, 7),
    },
    2023: {
        name: "Schtroumpfgatefest",
        subtitle: "Chez les Schtroumpfs",
        tagline: "La schtroumpferie a battu son plein !",
        dates: "9 au 11 juin",
        colors: { accent: "#4a8fe0", accentStrong: "#1f5fae", accentSoft: "#dce9fa" },
        banner: "/static/banners/2023.jpg",
        story: [
            "Aaah 2023, mes aïeux quelle époque ! La schtroumpferie a battu son plein lors d'un week-end full diableries, où nos amis les Schtroumpfs ont pu jouer à Qui-Est-ce, manger des Schtroumpfgaufres et se restaurer de bonnes Schtroumpfpizzas.",
            "Les gagnants du fameux \"Où sont les Schtroumpfs\" ont pu se régaler et ramener chez eux une preuve de leur participation... Ce n'est pas tout ! Alléchés par l'odeur du piment fortifié, les Schtroumpfs se sont frottés à l'échelle de Schtroumpfville, et comme disait le Schtroumpf Naps, \"C'était la piquance !\".",
            "Enfin, des mélanges plus improbables les uns que les autres ont eu raison des plus vaillants d'entre nous. Pour ces premiers jeux individuels, c'est le RaphaSchtroumpf qui l'a emporté grâce à toute la pugnacité qui caractérise le Bébé Schtroumpf !",
        ],
        photos: photos(2023, 6),
    },
    2022: {
        name: "Les Visit'heures 2",
        subtitle: "L’APÉRO !",
        tagline: "À conditions exceptionnelles, événement exceptionnel !",
        dates: "10 au 12 juin",
        colors: { accent: "#b07a3c", accentStrong: "#7a4f1f", accentSoft: "#f1e2cc" },
        banner: "/static/banners/2022.jpg",
        link: "https://www.facebook.com/events/996521040904216/",
        story: [
            "L’édition 2022 fut particulière ! En effet, elle n’a pas eu lieu à Houlgate ! Eh non… Mais qu’à cela ne tienne ! À conditions exceptionnelles, événement exceptionnel ! Le Houlgatefest se retire et laisse place aux Visit'heures 2 : l’APÉRO !",
            "Le principe ? Deux jours de banquet, trois tribus, des défis, des jeux, de la musique et surtout de la bonne humeur !",
            "Cette année, les nobles, le clergé et les paysans (berk !) s’affrontaient pour ramener le plus de moula à la maison ! Des scènes d’une rare violence ont pu être observées au cours de ce week-end. Les participants ont poussé leur corps au bout de leurs limites. Mais toujours dans la bonne humeur hein ?! Et ce sont finalement les paysans qui ont raflé le plus thunasses pour gagner ce spin-off 2022 ! Bravo à eux !",
        ],
        photos: photos(2022, 5),
    },
    2021: {
        name: "La Gavle de Bois",
        subtitle: "HoulgateFest et la Gavle de Bois",
        tagline: "Trois tribus pour revendiquer la souveraineté du domaine !",
        dates: "11 au 13 juin",
        colors: { accent: "#2f6aa3", accentStrong: "#1d4a77", accentSoft: "#dbe6f2" },
        banner: "/static/banners/2021.jpg",
        link: "https://www.facebook.com/events/773462923524929",
        story: [
            "Pour cette année, ce sont trois tribus qui se sont affrontées pour revendiquer la souveraineté du domaine ! Au programme, combat de chefs, défis relevés, concerts de bardes, shifumi et concours de pets !",
            "Et malgré leurs différences, les participants ont su mettre de côté leurs tensions et faire régner la joie de vivre tout au long du week-end !",
            "Mais bon, comme on n’est pas là pour enfiler des perles, il faut bien un gagnant ! Et c’est la tribu des Romaintiques qui a remporté cette édition 2021 ! On les félicite… Ou pas.",
        ],
        photos: photos(2021, 4),
    },
    2020: {
        name: "La Coupe de F",
        subtitle: "HoulgateFest et la Coupe de F",
        tagline: "Houlgate se transforme en Poulgate !",
        dates: "25 au 27 septembre",
        colors: { accent: "#7d4bb3", accentStrong: "#5a2f8a", accentSoft: "#ebe0f6" },
        banner: "/static/banners/2020.jpg",
        link: "https://www.facebook.com/events/1263546553855244/",
        story: [
            "Édition initialement prévue le weekend du 26 juin 2020 mais repoussée cause Covid.",
            "Cette année, Houlgate se transforme en Poulgate et les différents participants sont répartis dans quatre maisons de sorciers.",
            "L’objectif étant d’accumuler les points lors de quiz, jeux et défis afin de faire gagner sa maison. Une fois n’est pas coutume, ce sont les Serpentards qui ramenèrent la coupe à la maison.",
        ],
        photos: photos(2020, 3),
    },
    2019: {
        name: "Le Retour",
        subtitle: "HoulgateFest Le Retour",
        tagline: "Un an plus tard, la fiesta est de retour à Houlgate.",
        dates: "27 au 29 juin",
        colors: { accent: "#ea8a3c", accentStrong: "#a9561a", accentSoft: "#fbe6d3" },
        banner: "/static/banners/2019.jpg",
        link: "https://www.facebook.com/events/420496642092857/",
        story: [
            "Un an plus tard, la fiesta est de retour à Houlgate. La passion de l’alcool est toujours présente et se voit même renforcée avec la dégustation de la fameuse bière artisanale “Délivrez-nous du Malt”.",
            "Première compétition également: les Olympiadasses !",
            "Deux équipes s’affrontent tout au long du weekend. Ce sera finalement la Team Tirajosaure qui prendra le meilleur sur la Team Sir Concis.",
        ],
        photos: photos(2019, 2),
    },
    2018: {
        name: "La Naissance",
        subtitle: "Naissance du HoulgateFest",
        tagline: "Les pionniers de la nouba normande investissent Houlgate.",
        dates: "8 au 10 juin",
        colors: { accent: "#3d97c9", accentStrong: "#1f6c96", accentSoft: "#dbeef8" },
        banner: "/static/banners/2018.jpg",
        link: "https://www.facebook.com/events/412313352536608/",
        story: [
            "Les pionniers de la nouba normande investissent Houlgate le temps d’un weekend. Les survivants décrivent encore aujourd’hui un état d’esprit commun à toutes les personnes présentes sur place en 2018: une passion non dissimulée pour le houblon, les spiritueux et la boisson bien distillée en général.",
            "Aucune trace de compétition. Le shotgun sur le site échoue lamentablement.",
            "Passage remarqué et remarquable de cette joyeuse équipée au Royalty, établissement culinaire (ayant dû fermer pour 6 mois de travaux et près de 14 plaintes de la Mairie et des riverains suite à cet événement).",
        ],
        photos: photos(2018, 1),
    },
};

// Signature of the archive's texts
export const HISTORY_AUTHORS = "Hugo Bis & Raphoune";

export const LATEST_THEMED_YEAR = Math.max(...Object.keys(THEMES).map(Number));

const FALLBACK_COLORS = { accent: "#2a8197", accentStrong: "#175a6e", accentSoft: "#dceeed" };

// A year the front doesn't know yet: a plain seaside poster until its entry is added above
const fallbackTheme = (year) => ({
    name: "HoulgateFest " + year,
    subtitle: "Villa Les Genêts",
    tagline: "Le thème de l’édition se prépare en coulisses… Restez branchés !",
    colors: FALLBACK_COLORS,
    banner: null,
    intro: [],
    notes: [],
    illustrations: [],
    photos: [],
    isFallback: true,
});

export const getTheme = (year) => {
    const theme = THEMES[year];
    if (!theme) return { year, ...fallbackTheme(year) };

    return { year: Number(year), intro: [], notes: [], illustrations: [], ...theme };
};

// The archive, most recent first
export const getArchive = () =>
    Object.keys(THEMES)
        .map(Number)
        .sort((a, b) => b - a)
        .map(getTheme);

// CSS custom properties applying an edition's colours to a subtree
export const themeStyle = (theme) => ({
    "--accent": theme.colors.accent,
    "--accent-strong": theme.colors.accentStrong,
    "--accent-soft": theme.colors.accentSoft,
    "--accent-ink": "#ffffff",
});
