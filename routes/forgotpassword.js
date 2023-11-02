const express=require('express');
const forgotController=require('../controller/forgotcontroller');
const authmiddleware = require('../middleware/authentication')
const router=express.Router();

router.get('/forgotform',forgotController.getForm);

router.post('/password/forgotpassword',forgotController.postForgotpass);

router.get('/password/resetpasswordform/:uuid',forgotController.getResetpassForm)
router.post('/password/update',forgotController.postUpdate)


// router.post('/addexpense',authmiddleware.authenticate ,expenseController.postAddExpense)
// router.delete('/deletexpense/:id',authmiddleware.authenticate ,expenseController.delExpense)


module.exports=router;