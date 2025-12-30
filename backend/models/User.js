const mongoose = require("mongoose");
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profil Detayları
  age: { type: Number },
  avatar: { type: String, default: "https://i.pravatar.cc/300" }, // Varsayılan resim
  bio: { type: String, default: "" },

  // Vibe'lar (Profilde görünsün ama şimdilik eşleşme algoritması yok)
  vibes: [{ type: String }], 

  // Konum (GeoJSON - Harita için KRİTİK)
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
}, { timestamps: true });

// Harita sorguları için index (Burası çok önemli!)
UserSchema.index({ location: "2dsphere" });

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(18).max(100),
  });

  return schema.validate(user);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User, validateUser };