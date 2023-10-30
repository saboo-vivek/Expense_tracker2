const express = require('express');
const authmiddleware = require('../middleware/authentication')
const purchaseController = require('../controller/purchase');

const router = express.Router();

router.get('/purchase/premium', authmiddleware.authenticate ,purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', authmiddleware.authenticate ,purchaseController.updateTransaction);


router.post('/purchase/updatetransactionfail', authmiddleware.authenticate ,purchaseController.updateTransactionFail);

module.exports = router ;