class Helper{
    static extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }
}

module.exports = Helper;