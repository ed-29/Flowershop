const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: { type: String, required: true },
    verified: { type: Boolean, default: false },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    response: {
      text: String,
      date: Date,
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },
  { timestamps: true }
);

// Ensure one review per customer per product
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
