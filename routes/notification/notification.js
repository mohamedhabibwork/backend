let router =require('express').Router();
let {showOne,deleteOne,index,createOne,updateOne,sendAll} =require('../../controller/notification/notification.controller');

router.get('/user/notifications',index);
router.post('/users/send/notification',sendAll);
router.get('/users/notification/:id',showOne);
router.post('/users/create/notification/',createOne);
router.post('/users/notification/update/:id',updateOne);
router.post('/users/notification/delete/:id',deleteOne);


module.exports=router;