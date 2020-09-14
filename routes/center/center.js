const { isAdmin } = require("../../middelware/auth");
let router = require('express').Router();
let { showOne, deleteOne, index, updateOne, createOne } = require('../../controller/center/center.controller');

router.get('/user/centers', index);
router.get('/user/center/:id', showOne);
router.post('/user/create/center', isAdmin, createOne);
router.post('/user/center/update/:id', isAdmin, updateOne);
router.post('/user/center/delete/:id', isAdmin, deleteOne);



module.exports = router;