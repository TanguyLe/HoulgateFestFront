let mongoose = require("mongoose"),
    Edition = mongoose.model("Edition");


exports.getEditions = (callback, errCallback = (() => {})) => {
    Edition.find({}, {__v: 0}).then(callback).catch(errCallback)
};


exports.getCurrentEditionFromEditions = (editions) => {
    return editions.find((edition) => edition.year === (new Date()).getFullYear())
};
