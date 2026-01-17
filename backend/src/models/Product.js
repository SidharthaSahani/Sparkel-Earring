const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category_id: { type: String, required: true },
  images: [String],
  colors: [String],
  sizes: [String],
  stock: { type: Number, required: true },
  is_featured: { type: Boolean, default: false },
  is_new_arrival: { type: Boolean, default: false },
  is_best_seller: { type: Boolean, default: false },
  discount_percentage: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);