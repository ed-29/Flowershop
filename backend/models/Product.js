const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['bouquets', 'arrangements', 'plants', 'occasions', 'seasonal']
    },
    stock: { type: Number, default: 0, required: true },
    inSeason: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    featured: { type: Boolean, default: false },
    tags: [String],
    careInstructions: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
