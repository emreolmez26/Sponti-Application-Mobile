const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Hangi etkinliğin sohbeti? (Oda ID'miz bu olacak)
    activityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Activity', 
    required: true 
  },

  // Kim yazdı?
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Ne yazdı?
  content: { type: String, required: true },

  // Mesaj Tipi (İleride resim/konum atmak istersen diye)
  type: { type: String, enum: ['text', 'image', 'location'], default: 'text' }

}, { timestamps: true }); // createdAt otomatik eklenecek

module.exports = mongoose.model('Message', messageSchema);