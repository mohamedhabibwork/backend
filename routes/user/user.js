let router = require('express').Router();
// let {authVerify} =require('../../middelware/auth');
let { showOne, deleteOne, index, updateOne, addPayment, deletePayment } = require('../../controller/user/user.controller');
// /user
router.get('/users', index);
router.get('/users/:id', showOne);
router.post('/user/addPayment', addPayment);
router.post('/user/deletePayment', deletePayment);
router.post('/users/update/:id', updateOne);
router.post('/users/delete/:id', deleteOne);

module.exports = router;