import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'restaurant', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
    trim: true,
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
  },
  companyCode: {
    type: String,
    uppercase: true,
    trim: true,
  },
  company: {
    name: String,
    logo: String,
    benefits: String,
    building: String,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  addresses: [{
    label: String,
    building: String,
    floor: String,
    room: String,
    notes: String,
    isDefault: Boolean,
  }],
  subscription: {
    type: {
      type: String,
      enum: ['none', 'lunch-pass', 'team-plan'],
      default: 'none',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
    },
    startDate: Date,
    endDate: Date,
    stripeSubscriptionId: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
