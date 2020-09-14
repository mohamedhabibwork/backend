const {isAdmin} = require("../../middelware/auth");
let router =require('express').Router();
let {showOne,deleteOne,createOne,index,updateOne} =require('../../controller/transaction/transaction.controller');

router.get('/user/transactions',index);
router.get('/user/transaction/:id',showOne);
router.post('/user/create/transaction',createOne);
router.post('/user/transaction/update/:id',isAdmin,updateOne);
router.post('/user/transaction/delete/:id',isAdmin,deleteOne);

module.exports=router;