const express = require("express");
const router = express.Router();

// 1. BURAYA 'getAllActivities' EKLEDİK (En sona dikkat) 👇
const { 
  createActivity, 
  getNearbyActivities, 
  joinActivity,
  manageRequest,
  getMessages,
  getAllActivities,
  getMyActivities,
  getPendingRequests,
  getIncomingRequests // <-- YENİ EKLENEN PARÇA
} = require("../controller/activityController");

const auth = require("../middleware/authMiddleware");

// Etkinlik Oluştur
router.post("/activities", auth, createActivity);

// 2. BURAYA YENİ ROTAYI EKLEDİK 👇
// Frontend'in harita için çağırdığı adres bu:
router.get("/activities", auth, getAllActivities); 

// Yakındakiler
router.get("/activities/nearby", auth, getNearbyActivities);

// Katılma İsteği
router.post("/activities/:id/join", auth, joinActivity);

// İstek Yönetimi
router.put("/activities/:id/manage-request", auth, manageRequest);

// Mesajlar
router.get("/activities/:id/messages", auth, getMessages);

// Kullanıcının etkinlikleri
router.get("/activities/my-activities", auth, getMyActivities); // <-- Doğru path

router.get("/activities/:id/requests", auth, getPendingRequests);

// Gelen İstekler (Bildirimler)
router.get("/activities/incoming-requests", auth, getIncomingRequests);



module.exports = router;