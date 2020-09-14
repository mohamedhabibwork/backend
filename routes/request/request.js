let router = require('express').Router();
const { isAdmin } = require("../../middelware/auth");

let { showOne, deleteOne, createOne, AllRequest, refuseRequest, acceptRequest, index, updateOne } = require('../../controller/request/request.controller');
// request
router.get('/user/requests', index);
router.post('/user/refuse/request/:id', isAdmin, refuseRequest);
router.post('/user/Accept/request/:id', isAdmin, acceptRequest);
router.get('/user/request', AllRequest);
router.get('/user/request/:id', showOne);
router.post('/user/create/request', createOne);
router.post('/user/request/update/:id', updateOne);
router.post('/user/request/delete/:id', deleteOne);

module.exports = router;