const express = require('express');
const authmiddleware = require('../middleware/authentication')
const premiumController = require('../controller/premium');

const router = express.Router();

router.get('/premium/getleaderboard', authmiddleware.authenticate ,premiumController.getLeaderBoard);

router.get('/premium/reportgeneration', authmiddleware.authenticate ,premiumController.getReport);


// router.post('/purchase/updatetransactionfail', authmiddleware.authenticate ,purchaseController.updateTransactionFail);

module.exports = router ;