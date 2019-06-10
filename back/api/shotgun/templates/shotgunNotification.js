exports.getShotgunNotificationContent = (owner, room, users) => {
    return (`<head>
        <style>
        </style>
    </head>
    <br/>
    Félicitations, tu as trouvé un endroit où dormir dans la belle villa des Gênets!
        <br/><br/><br/>
    <p>
    Récapitulatif de ton shotgun:
        <ul>
            <li>` + owner + ` a réservé la chambre ` + room + `</li>
            <li>Compagnons de chambre :
                <ul> ` + users + `</ul>
            </li>
        </ul>
        </p>
    <br/> <br/> <br/>
    <b>Merci et à bientôt!</b>
    <br/>
    <br/>
    <i>Au cas où tu te poses la question c'est un message automatique, ça sert à rien de répondre banane.</i>`);
};
