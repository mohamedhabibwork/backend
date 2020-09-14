let Request = require('../../model/RequestPayments/request');
const $ = require('currency.js')
const {
    MakeNotification,
    SendNotificationToUser,
    SendTransactionToUser,
    MakeTransaction,
    CenterUpdateWallet,
    UserUpdateWallet
} = require("../../functions");
let Center = require('../../model/exchangeCenter/center');
let User = require('../../model/user/user');
const { requestData, requestUpdateData } = require("../../model/RequestPayments/validation");

exports.index = async(req, res) => {
    let request = await Request.find({ '_id': { $in: req.user.requests } }, function(err) {
        if (err) return res.status(400).json(err);
    });
    return res.json({ request, status: true })
};
exports.AllRequest = async(req, res) => {
    let request = await Request.find({ requestCase: "Pending" },
        function(err) {
            if (err) return res.status(400).json(err);
        });
    return res.json({ request, status: true })
};

exports.createOne = async(req, res) => {
    let { error, value } = await requestData(req.body);
    if (error) return res.json({ error: error.details.map((err) => err.message) });
    value.userID = req.user._id;
    value.data = req.body;
    let request = new Request(value);
    request = await request.save();
    req.user.requests.push(request._id);
    // req.user.requests.push(request);
    await req.user.save();
    return res.json({ status: true, request })
};

exports.showOne = async(req, res) => {
    let request = await Request.findById(req.params.id, (err, request) => {
        if (err) return res.status(404).json(err);
        // return res.json({status:true,request});
    });
    return res.json({ status: true, request })
};

//Request
exports.updateOne = async(req, res) => {
    let { error, value } = await requestUpdateData(req.body);
    if (error) return res.json({ error: error.details[0].message, validation: true });
    value.updatedAt = Date.now();
    let request = await Request.findByIdAndUpdate(req.params.id, value, (err, request) => {
        if (err) return res.status(400).json(err);
        // return res.json({status:true,request});
    });
    if (req.body.length) {
        request.data.push(req.body);
        await request.save();
    }
    return res.json({ status: true, request });
};

exports.deleteOne = async(req, res) => {
    let request = await Request.findByIdAndRemove(req.params.id, req.body, (err, request) => {
        if (err) return res.status(400).json(err);
        // return res.json({status:true,request});
    });
    return res.json({ status: true, request });
};

exports.acceptRequest = async(req, res) => {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId)
        if (!request) return res.status(404).json({
            message: "Fetching Request Data failed"
        });
        const userId = request.userID;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({
            message: "Fetching user Data failed"
        });
        let userCurrencyFrom = user.wallet.filter((w) => (w.currency.toUpperCase() === request.from.toUpperCase()))[0];
        let userCurrencyTo = user.wallet.filter((w) => w.currency.toUpperCase() === request.to.toUpperCase())[0];

        //buy request
        if (request.name.toLowerCase() === "buy") {
            let total = userCurrencyFrom.amount - request.amount;
            if (total >= 0) {
                let totalFrom = (parseFloat(userCurrencyFrom.amount) - parseFloat(request.amount));
                let totalTo = (parseFloat(userCurrencyTo.amount) + parseFloat(request.total));
                if (await UserUpdateWallet(userId, request.from, totalFrom)) {
                    if (await UserUpdateWallet(userId, request.to, totalTo)) {
                        await CenterUpdateWallet(request.to, -request.total);
                        let note = await MakeNotification({ userID: req.user._id, title: "Accept your Request", message: "this request is Accepted by admin" });
                        await SendNotificationToUser({ userID: request.userID, notificationID: note._id });
                        let t = await MakeTransaction({
                            toCurrency: request.to,
                            formCurrency: request.from,
                            count: request.amount,
                            name: request.name,
                            method: "Using - Card " + '*******' + request.method[request.method.length - 4] + request.method[request.method.length - 3] + request.method[request.method.length - 2] + request.method[request.method.length - 1],
                            rate: request.rate,
                            total: request.total,
                            userID: userId,
                        });
                        await SendTransactionToUser({ userID: userId, transactionID: t._id })
                        request.requestCase = "Accept"
                        await request.save();
                        return res.json({ status: true, request }).status(200);
                    }
                }

            } else {
                request.requestCase = "Refuse";
                if (await request.save()) {
                    let note = await MakeNotification({ userID: req.user._id, title: "refuse your Request", message: "this request is refuse by admin No Money Enogth" });
                    await SendNotificationToUser({ userID: request.userID, notificationID: note._id });
                }
            }
        } else if (request.name.toLowerCase() === "sell") {
            let total = userCurrencyFrom.amount - request.amount;
            if (total >= 0) {
                let totalFrom = (parseFloat(userCurrencyFrom.amount) - parseFloat(request.amount));
                let totalTo = (parseFloat(userCurrencyTo.amount) + parseFloat(request.total));
                if (await UserUpdateWallet(userId, request.from, totalFrom)) {
                    console.log('totalFrom:' + totalFrom);
                    if (await UserUpdateWallet(userId, request.to, totalTo)) {
                        console.log('totalTo:' + totalTo);
                        await CenterUpdateWallet(request.from, request.total);
                        let note = await MakeNotification({ userID: req.user._id, title: "Accept your Request", message: "this request is Accepted by admin" });
                        await SendNotificationToUser({ userID: userId, notificationID: note._id });
                        let t = await MakeTransaction({
                            toCurrency: request.to,
                            formCurrency: request.from,
                            count: request.amount,
                            name: request.name,
                            method: "Using - Card " + '*******' + request.method[request.method.length - 4] + request.method[request.method.length - 3] + request.method[request.method.length - 2] + request.method[request.method.length - 1],
                            rate: request.rate,
                            total: request.total,
                            userID: userId,
                        });
                        await SendTransactionToUser({ userID: userId, transactionID: t._id })
                        request.requestCase = "Accept";
                        await request.save();
                        return res.json({ status: true, request }).status(200);
                    }
                }

            } else {
                request.requestCase = "Refuse";
                if (await request.save()) {
                    let note = await MakeNotification({ userID: req.user._id, title: "refuse your Request", message: "this request is refuse by admin No Money Enogth" });
                    await SendNotificationToUser({ userID: request.userID, notificationID: note._id });
                }
            }

        }
        return res.json({ status: true, request });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
    return res.json({ status: true, request });
};

exports.refuseRequest = async(req, res) => {
    if (req.user.roles.filter((role) => role.name.toLowerCase() === "admin").length) {
        let request = await Request.findByIdAndUpdate(req.params.id, { requestCase: "Refuse" }, async(err, request) => {
            if (err) return res.status(400).json(err);
            let note = await MakeNotification({ userID: req.user._id, title: "refuse your Request", message: "this request is refuse by admin" });
            await SendNotificationToUser({ userID: request.userID, notificationID: note._id });
        }).catch(err => {
            if (err) return res.status(400).json(err);
        });
        return res.json({ status: true, request });
    }
    return res.json({ status: false }).status(403);
};