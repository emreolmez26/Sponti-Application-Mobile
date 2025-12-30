const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["coffee", "game", "study", "walk", "sports", "chat"],
      required: true,
    },

    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      addressName: { type: String }, // Örn: "Starbucks, Kadıköy"
    },

    time: { type: Date, required: true },

    participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // Bekliyor, Kabul, Red
        default: 'pending', // Varsayılan olarak "Bekliyor" olsun
      },
    },
  ],

    // Etkinlik durumu
    status: {
      type: String,
      enum: ["active", "full", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Haritada "Yakındakileri Bul" diyebilmek için Index şart!
activitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Activity", activitySchema);
