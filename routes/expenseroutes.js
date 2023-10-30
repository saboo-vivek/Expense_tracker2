const express=require('express');
const expenseController=require('../controller/expenseController');
const authmiddleware = require('../middleware/authentication')
const router=express.Router();

router.get('/app',expenseController.getApp);
router.get('/pastentries',authmiddleware.authenticate ,expenseController.getAll);
router.post('/addexpense',authmiddleware.authenticate ,expenseController.postAddExpense)
router.delete('/deletexpense/:id',authmiddleware.authenticate ,expenseController.delExpense)


module.exports=router;