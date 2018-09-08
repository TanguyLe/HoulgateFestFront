module.exports = {
    getMongoDbFromArgs: () => {
        console.log("Specifies database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url");

        // Get arguments passed on command line
        let userArgs = process.argv.slice(2);
        if (!userArgs[0].startsWith("mongodb://"))
            throw "ERROR: You need to specify a valid mongodb URL as the first argument";

        return userArgs[0];
    }
};
