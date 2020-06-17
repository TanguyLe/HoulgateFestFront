export default (date) => {
    return (
        date
            .toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
            .split(':')
            .slice(0, 2)
            .join(':')
    )
}