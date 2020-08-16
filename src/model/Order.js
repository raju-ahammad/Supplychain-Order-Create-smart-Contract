const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
  index: { type: Number },
  supplier: { type: String },
  deliveryCompany: { type: String },
  customer: { type: String },
});

module.exports = mongoose.model('Order', OrderSchema);