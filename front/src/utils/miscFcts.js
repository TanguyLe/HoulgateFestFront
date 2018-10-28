export const upCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const objectMap = (object, mapFn) => {
    return Object.keys(object).reduce((result, key) => {
        result[key] = mapFn(object[key]);
        return result;
    }, {});
};
