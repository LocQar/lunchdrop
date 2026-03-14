import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    default: 'zone-a',
  },
  workers: {
    type: Number,
    default: 0,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, {
  timestamps: true,
});

const Building = mongoose.model('Building', buildingSchema);

export default Building;
