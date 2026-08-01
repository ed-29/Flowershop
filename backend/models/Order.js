const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { 
      type: String, 
      unique: true,
      required: true
    },
    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [{
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    deliveryDate: Date,
    specialInstructions: String,
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    trackingNumber: String
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
