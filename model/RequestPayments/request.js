let mongoose = require('mongoose');

let requestSchema = new mongoose.Schema({
    amount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    userID: { type: Object },
    to: { type: String }, // currency NEO
    from: { type: String }, // currency USD
    method: { type: String }, // currency USD
    name: { type: String }, // buy sell
    rate: { type: Number }, // buy sell  Rate
    requestCase: { type: String, default: 'Pending' }, //Pending Accept Refuse
    data: { object: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);