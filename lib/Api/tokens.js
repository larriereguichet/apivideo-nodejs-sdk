let Tokens = function(browser) {

  this.browser = browser;

  this.generate = async function() {
    let that = this;
    let response = await this.browser.post('/tokens');

    return new Promise(function(resolve, reject) {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        let token = that.cast(response.body);
        resolve(token);
      }
    }).catch(function(e) {
      console.log(e.statusCode);
    });
  };
};

Tokens.prototype.cast = function(data) {
  if (!data) {
    return null;
  }

  return data.token;
};

module.exports = Tokens;