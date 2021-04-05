export default (date) => {
    let _date = new Date(date);
    // Convert to Paris time
    const tzoffset = _date.getTimezoneOffset() * 60000;
    _date = (new Date(_date - tzoffset)).toISOString().slice(0, -1);

    return (
        _date
            .replace(/T/, ' ')
            .replace(/\..+/, '')
            .split(':')
            .slice(0, 2)
            .join(':')
    );
}
