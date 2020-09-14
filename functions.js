const User = require("./model/user/user");
const Center = require("./model/exchangeCenter/center");
const Notification = require("./model/notifications/notification");
const Transaction = require("./model/transactions/transaction");
exports.MakeNotification = async(data) => {
    return await new Notification(data).save();
};

exports.SendNotificationToAll = async(notificationID) => {
    return await User.updateMany({}, {
        $push: { notifications: notificationID }
    });
};

exports.MakeNewWalletToAllUsers = async(centerId, currency) => {
    return await User.updateMany({}, { $push: { wallet: { amount: 0, currency, centerId: centerId } } });
};


exports.UserUpdateWallet = async(userID, currency, amount) => {
    console.log('Amount', amount, 'Currncy', currency, 'Userid', userID)
    let user = await User.updateOne({
        _id: userID,
        "wallet.currency": currency.toUpperCase()
    }, {
        $set: { "wallet.$.amount": parseFloat(amount) }
    })
    return (!user) ? false : true;
};

exports.CenterUpdateWallet = async(currency, amount) => {
    let center = await Center.findOne({ currency: currency.toUpperCase() });
    center.wallet += amount;
    return await center.save();
};

exports.SendNotificationToUser = async({ userID, notificationID }) => {
    if (notificationID && userID) return await User.findByIdAndUpdate(userID, { $push: { notifications: notificationID } });

};

exports.SendTransactionToUser = async({ userID, transactionID }) => {
    if (transactionID && userID) return await User.findByIdAndUpdate(userID, { $push: { transactions: transactionID } });

};
exports.MakeTransaction = async(data) => {
    return await new Transaction(data).save();
};