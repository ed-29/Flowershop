const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    phone: String,
    role: {
      type: String,
      enum: ['customer', 'admin', 'employee'],
      default: 'customer'
    },
    addresses: [{
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      isDefault: { type: Boolean, default: false }
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    isActive: { type: Boolean, default: true },
    activity: [{ type: { type: String }, message: String, meta: mongoose.Schema.Types.Mixed, date: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
