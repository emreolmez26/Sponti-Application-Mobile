const Activity = require("../models/Activity");
const Message = require('../models/Message'); 

const createActivity = async (req, res) => {
  try {
    const { title, description, category, location, time } = req.body;

    if (!title || !location || !time) {
      return res
        .status(400)
        .json({ message: "Lütfen zorunlu alanları doldurun" });
    }

    const newActivity = await Activity.create({
      host: req.user._id,
      title,
      description,
      category,
      location: {
        type: "Point",
        coordinates: location.coordinates, // [lng, lat] frontend'den gelmeli
        addressName: location.addressName,
      },
      time,
    });
    res
      .status(201)
      .json({ message: "Etkinlik oluşturuldu", activity: newActivity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sunucu hatası. Etkinlik oluşturulamadı." });
  }
};

// @desc    Yakındaki etkinlikleri listele
// @route   GET /api/activities/nearby
// @access  Public (veya Private, tercihe bağlı)

const getNearbyActivities = async (req, res) => {
  try {
    // 1. Query parametrelerinden koordinatları al
    // Örn URL: /api/activities/nearby?lat=40.99&lng=29.02&dist=5
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Lütfen enlem (lat) ve boylam (lng) girin." });
    }

    // Yarıçap (Varsayılan 5km, kullanıcı girerse o kadar)
    // MongoDB metre cinsinden çalışır, bu yüzden 1000 ile çarpıyoruz.
    const maxDistance = (dist || 5) * 1000;

    const activities = await Activity.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // DİKKAT: Önce Boylam, Sonra Enlem!
          },
          $maxDistance: maxDistance,
        },
      },
      status: "active", // Sadece aktif olanları getir
    })
      .populate("host", "name avatar age vibes") // Host'un sadece bu bilgilerini getir (Şifreyi getirme)
      .sort({ time: 1 }); // En yakın zamandaki en üstte olsun

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Etkinlik bulunamadı." });
    }

    // 1. Host Kontrolü: Kendi etkinliğine istek atamazsın
    if (activity.host.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Kendi etkinliğine istek atamazsın" });
    }

    // 2. Kapasite Kontrolü (Sadece kabul edilenleri sayıyoruz)
    const acceptedCount = activity.participants.filter(
      (p) => p.status === "accepted"
    ).length;
    
    // Not: İleride modeline 'capacity' alanı eklersen burayı (acceptedCount >= activity.capacity) yapabilirsin.
    if (acceptedCount >= 4) {
      return res.status(400).json({ message: "Etkinlik kontenjanı dolu" });
    }

    // 3. Mükerrer Kayıt Kontrolü (Zaten listede var mı?)
    const alreadyRequested = activity.participants.find(
      (p) => p.user && p.user.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
      return res
        .status(400)
        .json({ message: "Zaten istek gönderdin veya listedesin" });
    }

    // Kullanıcıyı listeye ekle ama statüsü 'pending' (beklemede) olsun
    activity.participants.push({ 
      user: req.user._id, 
      status: 'pending' // <-- Kapıyı kilitledik, onay bekliyor
    });

    await activity.save();

    res
      .status(200)
      .json({ message: "Katılma isteği gönderildi, onay bekleniyor.", activityId: activity._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageRequest = async (req, res) => {
  try {
    const { userId, status } = req.body; // Kimi onaylıyoruz? Karar ne?
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }


    // 1. İşlemi yapan kişi Host mu? (Güvenlik)
    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    // 2. Karar geçerli mi?
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum (accepted veya rejected olmalı)' });
    }

    // 3. Kullanıcıyı listede bul
    const participant = activity.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(404).json({ message: 'Kullanıcı bu etkinlikte bulunamadı' });
    }

    // 4. Durumu güncelle
    participant.status = status;

    await activity.save();

    res.status(200).json({ message: `Kullanıcı isteği: ${status}`, activity });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const activityId = req.params.id;
    const messages = await Message.find({ activityId })
      .populate('sender', 'name avatar') // Gönderenin ismini ve avatarını al
      .sort({ createdAt: 1 }); // Eski mesajlar önce gelsin
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Mesajlar alınamadı.' });
  }
};

// Tüm etkinlikleri getir (Haritada pinleri görmek için gerekli)
const getAllActivities = async (req, res) => {
  try {
    // Tüm aktiviteleri bul, en yeni en üstte olsun
    // .populate('host') ekledik ki kimin oluşturduğunu da görebilelim
    const activities = await Activity.find()
      .populate("host", "name avatar") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Etkinlikler getirilemedi." });
  }
};
// Kullanıcının dahil olduğu (sahibi veya katılımcısı olduğu) etkinlikleri getir
const getMyActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({
      $or: [
        { host: userId }, // Benim kurduklarım (Her türlü görürüm)
        { 
          // 👇 SADECE 'accepted' OLANLARI GÖR
          participants: { 
            $elemMatch: { user: userId, status: 'accepted' } 
          }
        }
      ]
    })
    .populate('host', 'name avatar')
    .sort({ updatedAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Liste alınamadı." });
  }
};

// Etkinlikteki bekleyen istekleri getir
const getPendingRequests = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate({
        path: 'participants.user',
        select: 'name email' // Bekleyen kişinin ismini ve mailini al
      });

    if (!activity) return res.status(404).json({ message: "Etkinlik bulunamadı" });

    // Sadece 'pending' olanları filtrele
    const pendingUsers = activity.participants.filter(p => p.status === 'pending');

    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Host'a gelen tüm bekleyen istekleri getir (Bildirim Merkezi İçin)
const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Sahibi olduğum VE içinde 'pending' statüsünde katılımcı olan etkinlikleri bul
    const activities = await Activity.find({
      host: userId,
      "participants.status": "pending"
    })
    .populate("participants.user", "name avatar") // İstek atanların ismini al
    .select("title participants"); // Sadece başlık ve katılımcıları al yeter

    // 2. Veriyi Frontend'in kolay okuyacağı hale getir (Düzleştir)
    let notifications = [];
    
    activities.forEach(activity => {
      activity.participants.forEach(p => {
        if (p.status === 'pending') {
          notifications.push({
            _id: p._id, // İsteğin benzersiz ID'si (katılımcı satırı)
            activityId: activity._id,
            activityTitle: activity.title,
            user: p.user, // İstek atan kişi {name, _id, avatar}
          });
        }
      });
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Bildirimler alınamadı." });
  }
};

module.exports = { createActivity, getNearbyActivities, joinActivity, manageRequest, getMessages, getAllActivities, getMyActivities, getPendingRequests, getIncomingRequests };