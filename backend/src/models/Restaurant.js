import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  calories: Number,
  image: String,
  flags: [String], // V, GF, etc
  popular: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  customizations: [{
    group: String,
    required: Boolean,
    options: [{
      name: String,
      price: Number,
    }],
  }],
});

const menuCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [menuItemSchema],
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  tags: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  deliveryTime: {
    min: Number,
    max: Number,
  },
  menu: [menuCategorySchema],
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },
  maxDailyOrders: {
    type: Number,
    default: 100,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'pending',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  contact: {
    phone: String,
    email: String,
  },
}, {
  timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
