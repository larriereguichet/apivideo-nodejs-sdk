class AbstractBaseApi {
    constructor(browser) {
        if (new.target === AbstractBaseApi) {
            throw new TypeError("Cannot construct AbstractBaseApi instances directly");
        }
        this.browser = browser;
    }

}
module.exports = AbstractBaseApi;