const Account = require('../Model/account');
const Quota = require('../Model/quota');

const Accounts = function Accounts(browser) {
  this.browser = browser;

  this.get = async function get() {
    const that = this;
    const response = await this.browser.get(
      '/account',
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const account = that.cast(response.body);
        resolve(account);
      }
    }));
  };
};

Accounts.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const account = new Account();
  const quota = new Quota();
  quota.quotaUsed = data.quota.quotaUsed;
  quota.quotaRemaining = data.quota.quotaRemaining;
  quota.quotaTotal = data.quota.quotaTotal;

  account.quota = quota;

  return account;
};

module.exports = Accounts;
