import {SERVER_ENDPOINT} from "../constants";

export const CONTACT_URL = SERVER_ENDPOINT + "/contact";

export const regexes = {
    mail: {
        def: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
        error: "L'adresse mail n'est pas valide"
    },
    word: {
        def: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
        error: "Le champ contient des caractères interdits"
    },
    phone: {
        def: /(\+?[0-9]{1,3}|0)[0-9]{9}$/i,
        error: "Le format du numéro n'est pas valide."
    }
};

export const CONTACT_DEF = {
    mail: {
        label: "Email",
        type: "text",
        regex: regexes.mail,
        htmlElem: 'Input'
    },
    firstname: {
        label: "Prénom",
        type: "text",
        regex: regexes.word,
        htmlElem: 'Input'

    },
    lastname: {
        label: "Nom",
        type: "text",
        regex: regexes.word,
        htmlElem: 'Input'

    },
    phone: {
        label: "Téléphone",
        type: "text",
        regex: regexes.phone,
        htmlElem: 'Input'

    },
    content: {
        label: 'Contenu de la demande',
        type: "text",
        htmlElem: 'TextArea'

    }
};