export const getNbSeats = (place) => {
    let nbSeats = 0;

    place.floors.map((floor) => {
        floor.rooms.map((room) => {
            nbSeats += room.seats;
        });
    });

    return nbSeats;
};
