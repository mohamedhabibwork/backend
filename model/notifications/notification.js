let mongoose =require('mongoose');

let notificationSchema=new mongoose.Schema({
    title:          { type: String, default: 0},
    message:        { type: String, of: String },
    readAt:         { type: Date, default: null },
    userID:         { type: Object, default: null },
    createdAt:      { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now }
});

module.exports=mongoose.model('Notification',notificationSchema);