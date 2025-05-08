const mongoose = require('mongoose');
const { Schema } = mongoose;

const guestSchema = new Schema({
  email:  { type: String, required: true, match: /.+@.+\..+/ },
  status: { type: String, enum: ['Nerozhodnuto','Přijde','Nepřijde'], default: 'Nerozhodnuto' }
}, { _id: false });

const eventSchema = new Schema({
  name:        { type: String, required: true, maxlength: 200 },
  date:        { type: Date,   required: true },
  location:    { type: String, required: true },
  description: { type: String, default: '' },
  budget:      { type: Number, required: true, min: 0 },
  guests:      { type: [guestSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);