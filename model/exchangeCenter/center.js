let mongoose = require('mongoose');

let centerSchema = new mongoose.Schema({
    currency: { type: String },
    userID: { type: Object },
    total: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    transactions: { type: Array, of: String },
    dailyRates: { type: Array, of: String },
    changeRates: {
        type: Array,
        of: String,
        default: [{
            rate: 50,
            time: Date.now()
        }, {
            rate: 75,
            time: Date.now()
        }, {
            rate: 100,
            time: Date.now()
        }, {
            rate: 150,
            time: Date.now()
        }, {
            rate: 200,
            time: Date.now()
        }, ]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Center', centerSchema);