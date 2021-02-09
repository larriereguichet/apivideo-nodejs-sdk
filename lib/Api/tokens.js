const Tokens = function Tokens(browser) {
  this.browser = browser;

  this.generate = function generate() {
    return this.browser.post('tokens').then(this.cast);
  };
};

Tokens.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  return data.token;
};

module.exports = Tokens;
