import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  customizations: [{
    group: String,
    option: String,
    price: Number,
  }],
  specialInstructions: String,
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 2.50,
  },
  tax: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    building: String,
    floor: String,
    room: String,
    notes: String,
  },
  status: {
    type: String,
    enum: ['placed', 'batched', 'preparing', 'in_transit', 'delivered', 'cancelled'],
    default: 'placed',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'lunch-pass', 'company'],
    default: 'card',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  stripePaymentIntentId: String,
  promoCode: {
    code: String,
    discount: Number,
    type: String,
  },
  scheduledFor: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  notes: String,
  rating: {
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: Date,
  },
}, {
  timestamps: true,
});

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = `LCH-${Date.now().toString().slice(-6)}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
