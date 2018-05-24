function getBool(val) {
    return !!JSON.parse(String(val).toLowerCase());
}

module.exports = getBool;