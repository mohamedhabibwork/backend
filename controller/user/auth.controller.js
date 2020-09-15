let User = require('../../model/user/user');
let Center = require('../../model/exchangeCenter/center');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const { registerValidation, loginValidation } = require("../../model/user/validation");

async function getLocation() {
    try {
     
    let ip = await axios.get('https://ipapi.co/ip/').then(respone => respone.data).catch(err => console.log(err));
    let dataIP = await axios.get('https://ipapi.co/' + ip + '/json/').then(respone => respone.data);
    dataIP.createAt = Date.now();
    return dataIP;   
    } catch (error) {
        console.log(error);
        return null;
    }
}
exports.register = async(req, res) => {

    let { error } = await registerValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });
    let salt = await bcrypt.genSalt(10);
    let HashPassword = await bcrypt.hash(req.body.password, salt);
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: HashPassword,
        locations: []
    });

    if (await User.findOne({ email: req.body.email })) return res.json({ message: "email already Exists" });

    let centers = await Center.find({}).then(r => r.map((wallet) => {
        return {
            amount: 0,
            currency: wallet.currency,
            centerID: wallet._id,
        };
    }));
    let dataIP = await getLocation();
    user.locations.push(dataIP);
    try {
        user.wallet.push(...centers);
        user = await user.save();
        return res.json({ user });
    } catch (e) {
        return res.status(400).json({ stats: false, error: "Not Work" });
    }

};
exports.login = async(req, res) => {
    let { error } = await loginValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ message: "Email doesn't exists" });

    let compare = await bcrypt.compare(req.body.password, user.password);
    if (!compare) return res.json({ message: "Email or password wrong" });
    
    let token = jwt.sign({ _id: user._id }, process.env.TOKEN_LOGIN, { expiresIn: Date.now() + (60 * 60 * 24 * 365) });
    
    let expiresIn = Date.now() + 3600;
    
    let dataIP = await getLocation();
    if (dataIP) user.locations.push(dataIP);
    
    await user.save();
    
    res.header(process.env.TOKEN_NAME, token).json({
        [process.env.TOKEN_NAME]: /*"Bearer "+*/ token,
        expiresIn
    });

};
exports.logout = async(req, res) => {
    try {
        req.headers[[process.env.TOKEN_NAME]] = null;
        return await res.json({ message: "logged out", token: req.headers });
    } catch (e) {
        return res.json({ error: e.message }).sendStatus(400);
    }

};