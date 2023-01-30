module.exports = {
    isNull: (val) => val === null,
    copyList: (list) => JSON.parse(JSON.stringify(list))
}