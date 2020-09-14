let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: { type: String, min: 3, max: 255, trim: true },
    email: { type: String, min: 6, max: 255, unique: true, trim: true, index: true },
    password: { type: String, min: 6, max: 1024, trim: true },
    locations: { type: Array, of: Object },
    roles: { type: Array, of: String, default: [{ name: 'user' }] },
    permissions: { type: Array, of: String },
    notifications: { type: Array, of: Object },
    transactions: { type: Array, of: Object },
    wallet: { type: Array, of: Object, default: { amount: 0, currency: "USD", centerID: Object } },
    payments: { type: Array, of: String }, //visa
    requests: { type: Array, of: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);