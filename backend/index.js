const express = require("express");
const app = express();
require("dotenv").config();
const http = require("http"); // Node.js HTTP modülü
const { Server } = require("socket.io"); // Socket.IO sunucu sınıfı

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const Message = require("./models/Message");

const mongoose = require("mongoose");

const cors = require("cors");
app.use(cors());

app.use(express.json());

const server = http.createServer(app); // Express'i HTTP server'a sarıyoruz

const io = new Server(server, {
  cors: {
    origin: "*", // React Native (Mobil) heryerden bağlanabilsin diye
    methods: ["GET", "POST"],
  },
});
// ----

app.use("/api/auth", authRoutes);
app.use("/api", activityRoutes);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("SPONTI Backend API Çalışıyor! 🚀");
});

// --- SOCKET.IO MANTIĞI (Burayı birazdan dolduracağız) ---
io.on("connection", (socket) => {
  console.log("⚡ Kullanıcı bağlandı:", socket.id);

  // 1. Odaya Katılma (Etkinlik ID'si ile)
  socket.on("join_room", (data) => {
    const activityId = typeof data === 'string' ? data : data.activityId;
    socket.join(activityId);
    console.log(`Kullanıcı ${socket.id}, ${activityId} odasına katıldı.`);
  });

  // 2. Mesaj Gönderme
  socket.on("send_message", async (data) => {
    // data = { activityId, senderId, content } Frontend'den gelecek
    const { activityId, senderId, content } = data;

    try {
      // A. Mesajı Veritabanına Kaydet (Kalıcılık)
      const newMessage = await Message.create({
        activityId,
        sender: senderId,
        content,
      });

      // Mesajı kaydettikten sonra gönderenin detaylarını al (Avatar, İsim)
      // Böylece ekranda "Mehmet" yazabiliriz, sadece ID değil.
      const fullMessage = await newMessage.populate("sender", "name avatar");

      // B. Odadaki Herkese (Gönderen dahil) Mesajı Yay
      io.to(activityId).emit("receive_message", fullMessage);
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("❌ Kullanıcı ayrıldı");
  });
});
// -------------------------------------------------------

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server and Socket.IO is running on port ${PORT}`);
});
