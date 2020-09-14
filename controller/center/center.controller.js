let Center = require('../../model/exchangeCenter/center');
let User = require('../../model/user/user');
let Notification = require('../../model/notifications/notification');
const { MakeNewWalletToAllUsers } = require("../../functions");
const { SendNotificationToAll } = require("../../functions");
const { MakeNotification } = require("../../functions");
const { centerUpdateData, centerData } = require("../../model/exchangeCenter/validation");

exports.index = async(req, res) => {
    let centers = await Center.find({}, (err) => (err) ? res.status(400).json(err) : {});
    return res.json({ centers, status: true })
};

exports.createOne = async(req, res) => {
    let { error, value } = await centerData(req.body);
    if (error) return res.json({ error: error.details.map((err) => err.message) });
    value.userID = req.user._id;
    let center = await new Center(value);
    await center.save();
    await MakeNewWalletToAllUsers(center._id, center.currency);
    return res.json({ status: true, center })
};

exports.showOne = async(req, res) => {
    let center = await Center.findById(req.params.id, (err) => (err) ? res.status(400).json(err) : {});
    return res.json({ status: true, center })
};

//Center
exports.updateOne = async(req, res) => {
    let { error, value } = await centerUpdateData(req.body);
    if (error) return res.json({ error: error.details[0].message, validation: true });
    value.updatedAt = Date.now();
    let center = await Center.findByIdAndUpdate(req.params.id, value, async(err, center) => {
        if (err) return res.status(400).json(err);
        if (value.rate) {
            center.changeRates.push({
                rate: value.rate,
                time: Date.now()
            });
            let note = await MakeNotification({
                userID: req.user._id,
                title: 'System Notification',
                message: center.currency + " rate changed to " + value.rate
            });
            console.log(note);
            await SendNotificationToAll(note._id);
            await center.save();
            center.changeRates.push({
                rate: value.rate,
                time: Date.now()
            });
        }
        return res.json({ status: true, center });
    });

    return res.json({ status: true, center });
};

exports.deleteOne = async(req, res) => {
    let center = await Center.findByIdAndRemove({ _id: req.params.id }, req.body, (err, center) => {
        if (err) return res.status(400).json(err);
        // return res.json({status:true,center});
    });
    return res.json({ status: true, center });
};


//2507 NEO
//2760 LBA