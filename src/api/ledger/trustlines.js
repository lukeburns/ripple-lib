'use strict';
const _ = require('lodash');
const utils = require('./utils');
const validate = utils.common.validate;
const parseAccountTrustline = require('./parse/account-trustline');

function currencyFilter(currency, trustline) {
  return currency === null || trustline.specification.currency === currency;
}

function getAccountLines(remote, address, ledgerVersion, options, marker, limit,
    callback) {
  const requestOptions = {
    account: address,
    ledger: ledgerVersion,
    marker: marker,
    limit: Math.max(limit, 10),
    peer: options.counterparty
  };

  const currency = options.currency ? options.currency.toUpperCase() : null;
  remote.requestAccountLines(requestOptions, (error, data) => {
    return error ? callback(error) :
      callback(null, {
        marker: data.marker,
        results: data.lines.map(parseAccountTrustline)
          .filter(_.partial(currencyFilter, currency))
      });
  });
}

/*:: type Options = {currency: string, counterparty: string,
                     limit: number, ledgerVersion: number} */
function getTrustlines(account: string, options: Options,
    callback: () => void): void {
  validate.address(account);
  validate.options(options);

  const defaultLimit = 100;
  const limit = options.limit || defaultLimit;
  const ledgerVersion = options.ledgerVersion
                      || this.remote.getLedgerSequence();
  const getter = _.partial(getAccountLines, this.remote, account,
                           ledgerVersion, options);
  utils.getRecursive(getter, limit, callback);
}

module.exports = utils.wrapCatch(getTrustlines);
