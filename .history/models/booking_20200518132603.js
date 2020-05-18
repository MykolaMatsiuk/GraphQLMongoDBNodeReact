const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const bookingSchema = new Schema({

});

module.exports = mongoose.model('Booking', bookingSchema);