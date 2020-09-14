let mongoose = require('mongoose');

let transactionSchema = new mongoose.Schema({
    name: { type: String },
    method: { type: String },
    total: { type: Number, default: 0.0 },
    count: { type: Number, default: 0.0 },
    rate: { type: Number, default: 0.0 },
    userID: { type: Object, required: true },
    to: { type: String },
    formCurrency: { type: String, required: true },
    toCurrency: { type: String, max: 3, default: "USD", required: true },
    data: { type: Array, of: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);