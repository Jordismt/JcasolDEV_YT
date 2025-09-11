const mongoose = require('mongoose');


const ContactSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
email: { type: String, required: true, trim: true },
phone: { type: String, trim: true },
notes: { type: String, trim: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Contact', ContactSchema);