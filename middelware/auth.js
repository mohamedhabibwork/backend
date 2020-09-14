let jwt = require('jsonwebtoken');
const User = require("./../model/user/user");

exports.authVerify = async(req, res, next) => {
    try {
        const token = req.header(process.env.TOKEN_NAME);
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        let verified = await jwt.verify(token, process.env.TOKEN_LOGIN);
        req.user = await User.findOne({ _id: verified._id });
        if (req.user) return next();
        else return res.status(401).json({ message: "Unauthorized" });
    } catch (e) {
        return res.status(400).json({ e });
    }
};

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.roles.filter(role => role.name.toLowerCase() === "admin").length) next();
        else res.status(401).json({ message: "Unauthorized" });
    } catch (e) {
        return res.status(400).json({ e });
    }
};