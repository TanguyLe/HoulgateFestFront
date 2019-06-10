exports.villaLesGenets = {
    floors: [
        {
            name: "Rdc",
            size: {width: 13.14, height: 10.41},
            gridTemplate: {rows: "19% 20% 18% 43%", columns: "12% 18.5% 6% 30% 33.5%"},
            rooms: [
                {
                    name: "Entrée",
                    type: "passing",
                    gridPosition: {rows: {start: 3, end: 4}, columns: {start: 2, end: 4}},
                    seats: 0
                },
                {
                    name: "W.C1",
                    type: "restrooms",
                    gridPosition: {rows: {start: 2, end: 3}, columns: {start: 3, end: 4}},
                    seats: 0
                },
                {
                    name: "Escaliers1",
                    type: "stairs",
                    gridPosition: {rows: {start: 2, end: 3}, columns: {start: 2, end: 3}},
                    seats: 0
                },
                {
                    name: "Cuisine",
                    type: "kitchen",
                    gridPosition: {rows: {start: 2, end: 4}, columns: {start: 4, end: 6}},
                    seats: 0
                },
                {
                    name: "Salle de Bain1",
                    type: "bathroom",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 4, end: 5}},
                    seats: 0
                },
                {
                    name: "Petit Salon",
                    type: "livingRoom",
                    gridPosition: {rows: {start: 4, end: 5}, columns: {start: 5, end: 6}},
                    seats: 4
                },
                {
                    name: "Salle à Manger",
                    type: "livingRoom",
                    gridPosition: {rows: {start: 4, end: 5}, columns: {start: 1, end: 5}},
                    seats: 4
                }
            ]
        },
        {
            name: "Premier Etage",
            size: {width: 13.39, height: 9.26},
            gridTemplate: {rows: "23.5% 16.5% 44% 16%", columns: "10.5% 7.7% 6.7% 10.5% 26.30% 9.1% 29.2%"},
            rooms: [
                {
                    name: "Escalier2",
                    type: "passing",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 2, end: 4}},
                    seats: 0
                },
                {
                    name: "W.C2",
                    type: "restrooms",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 4, end: 5}},
                    seats: 0
                },
                {
                    name: "Salle de Bain2",
                    type: "bathroom",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 5, end: 6}},
                    seats: 0
                },
                {
                    name: "Escalier3",
                    type: "stairs",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 6, end: 7}},
                    seats: 0
                },
                {
                    name: "Placard",
                    type: "passing",
                    gridPosition: {rows: {start: 2, end: 3}, columns: {start: 2, end: 3}},
                    seats: 0
                },
                {
                    name: "Couloir1",
                    type: "passing",
                    gridPosition: {rows: {start: 2, end: 3}, columns: {start: 3, end: 7}},
                    seats: 0
                },
                {
                    name: "Chambre des Filles",
                    type: "bedroom",
                    gridPosition: {rows: {start: 1, end: 3}, columns: {start: 7, end: 8}},
                    seats: 3
                },
                {
                    name: "Chambre de Mita",
                    type: "bedroom",
                    gridPosition: {rows: {start: 3, end: 4}, columns: {start: 1, end: 4}},
                    seats: 3
                },
                {
                    name: "Chambre Verte",
                    type: "bedroom",
                    gridPosition: {rows: {start: 3, end: 4}, columns: {start: 4, end: 6}},
                    seats: 4
                },
                {
                    name: "Chambre de Nanny",
                    type: "bedroom",
                    gridPosition: {rows: {start: 3, end: 5}, columns: {start: 6, end: 8}},
                    seats: 4
                },
            ]
        },
        {
            name: "Deuxième Etage",
            size: {width: 4.31, height: 9.25},
            gridTemplate: {rows: "23.5% 10.5% 26% 40%", columns: "21% 79%"},
            rooms: [
                {
                    name: "Escalier4",
                    type: "stairs",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 1, end: 2}},
                    seats: 0
                },
                {
                    name: "Couloir2",
                    type: "passing",
                    gridPosition: {rows: {start: 2, end: 4}, columns: {start: 1, end: 2}},
                    seats: 0
                },
                {
                    name: "Chambre de Mapie",
                    type: "bedroom",
                    gridPosition: {rows: {start: 1, end: 3}, columns: {start: 2, end: 3}},
                    seats: 2
                },
                {
                    name: "Petite Chambre",
                    type: "bedroom",
                    gridPosition: {rows: {start: 3, end: 4}, columns: {start: 2, end: 3}},
                    seats: 2
                },
                {
                    name: "Chambre Parentale",
                    type: "bedroom",
                    gridPosition: {rows: {start: 4, end: 5}, columns: {start: 1, end: 3}},
                    seats: 3
                }
            ]
        },
        {
            name: "Extérieur",
            size: {width: 3.54, height: 7.73},
            gridTemplate: {rows: "30% 70%", columns: "45% 55%"},
            rooms: [
                {
                    name: "Plat",
                    type: "garden",
                    gridPosition: {rows: {start: 1, end: 2}, columns: {start: 1, end: 2}},
                    seats: 10
                },
                {
                    name: "Incliné",
                    type: "garden",
                    gridPosition: {rows: {start: 2, end: 3}, columns: {start: 1, end: 2}},
                    seats: 0
                },
                {
                    name: "Chemin",
                    type: "garden",
                    gridPosition: {rows: {start: 1, end: 3}, columns: {start: 2, end: 3}},
                    seats: 0
                }
            ]
        }
    ]
};
