var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var config = require('../config/config');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.merchantId,
  publicKey: config.publicKey,
  privateKey: config.privateKey
});

router.post('/', function(req, res, next) {
  var nonce = req.body.nonce;

  gateway.transaction.sale({
    amount: '1.00',
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (err) {
      console.log('Error:', err);
      res.send(err);
      return;
    }
    res.send({
      transactionId: result.transaction.id,
      transactionStatus: result.transaction.status,
      transactionCreatedAt: result.transaction.createdAt,
      payerEmail: result.transaction.paypal.payerEmail,
      payerFirstName: result.transaction.paypal.payerFirstName,
      payerLastName: result.transaction.paypal.payerLastName,
      transactionFeeAmount: result.transaction.paypal.transactionFeeAmount,
      success: result.success
    });
  });
});

module.exports = router;
