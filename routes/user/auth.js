let router =require('express').Router();
let {authVerify} =require('../../middelware/auth');
let {login,register,logout} =require('../../controller/user/auth.controller');

router.post('/register',register);
router.post('/login',login);
router.post('/logout',authVerify,logout);
//https://ipapi.co/91.148.168.34/json/;
module.exports=router;