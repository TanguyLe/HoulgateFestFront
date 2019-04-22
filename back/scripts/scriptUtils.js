module.exports = {
    getMongoDbFromArgs: () => {
        console.log("Specifies database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url");

        // Get arguments passed on command line
        let userArgs = process.argv.slice(2);
        if (!userArgs[0].startsWith("mongodb://"))
            throw "ERROR: You need to specify a valid mongodb URL as the first argument";

        return userArgs[0];
    },
    testUsers: [
        ["Patrick", "Rothfuss@rothfuss.je", "test", true],
        ["Ben", "Bova@bova.je", "test", true],
        ["Isaac", "Asimov@asimov.je", "test", true],
        ["Bob", "bob@bob.je", "test", true],
        ["Jim", "Jones@jones.je", "test", true],
        ["Julie", "julie@julie.je", "test", true],
        ["Marie", "marie@marie.je", "test", true],
        ["Claire", "claire@claire.je", "test", true]
    ]
};
