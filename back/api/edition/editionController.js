exports.getCurrentEditionFromEditions = (editions) => {
    return editions.find((edition) => edition.year === (new Date()).getFullYear())
};
