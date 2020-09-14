let User = require('../../model/user/user');
const { updateUserValidation, addPaymentValidation } = require("../../model/user/validation");


exports.index = async(req, res) => {
    return await User.find({}).then(response => res.json({ users: response })).catch(err => {
        res.json({ error: err })
    });
};

exports.showOne = async(req, res) => {
    let user = await User.findById(req.params.id).catch(err => res.status(404).json({ message: "not found", status: false }));
    return res.json({ user, status: true });
};

exports.updateOne = async(req, res) => {
    let { error } = await updateUserValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });
    value.updatedAt = Date.now();
    let user = User.findByIdAndUpdate(req.params.id, value, (err, user) => {
        if (err) return res.status(400).json(err);
        return res.json({ status: true, message: 'user Updated', user });
    });
    return res.json(user);
};

exports.addPayment = async(req, res) => {
    let { error, value } = await addPaymentValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });
    value.updatedAt = Date.now();
    let user = await User.findByIdAndUpdate(req.user._id, { $push: { payments: value } }, (err, user) => {
        if (err) return res.status(400).json(err);
        // return res.json({ status: true, message: 'user Updated', user });
    });
    return res.json({ status: true, message: 'user Updated', user });
};

exports.deletePayment = async(req, res) => {
    value.updatedAt = Date.now();
    let user = User.findByIdAndUpdate(req.params.id, value, (err, user) => {
        if (err) return res.status(400).json(err);
        // return res.json({ status: true, message: 'user Updated', user });
    });
    return res.json({ status: true, user });
};

exports.updateMe = async(req, res) => {
    let { error, value } = await updateUserValidation(req.body);
    if (error) return res.json({ error: error.details[0].message });
    value.updatedAt = Date.now();
    let user = req.user.findByIdAndUpdate(req.params.id, value, (err, user) => {
        if (err) return res.status(400).json(err);
        return res.json({ status: true, message: 'user Updated', user });
    });
    return res.json(user);
};

exports.updateMany = (req, res) => {
    let users = User.all();
    return res.json(users);
};

exports.deleteOne = async(req, res) => {
    return await User.findByIdAndRemove(req.params.id).then(response => res.json({ message: "Deleted User", user: response })).catch(err => {
        console.log(err);
        res.json({ message: "Not Found", user: {} })
    });
};

exports.deleteMany = async(req, res) => {
    let users = await User.findByIdAndRemove({ _id: req.body.users }).catch(err => res.status(400).json(err));
    return res.json(users);
};