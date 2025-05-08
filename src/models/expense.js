const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  title:   { type: String, required: true, maxlength: 200 },
  amount:  { type: Number, required: true, min: 0.01 },
  date:    { type: Date,   required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);