# SPONTI - Spontane Etkinlik Buluşma Platformu 🎉

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socketdotio" />
</p>

**SPONTI**, anlık aktivite planlamak ve yakınındaki insanlarla spontane buluşmalar gerçekleştirmek için geliştirilmiş modern bir sosyal mobil uygulamadır. Yalnız kalmak istemeyenler için mükemmel bir çözüm!

---

## 🌟 Ana Özellikler

### 📍 **Akıllı Konum Tabanlı Keşif**
- GPS ile otomatik konum tespiti
- 10 km çapında akıllı etkinlik filtreleme
- Gerçek zamanlı mesafe hesaplama
- Harita üzerinde görsel etkinlik gösterimi

### 🗺️ **İnteraktif Harita Deneyimi**
- React Native Maps entegrasyonu
- Özel etkinlik marker'ları
- Kart kaydırma-harita senkronizasyonu
- Detaylı konum bilgileri

### 💬 **Gerçek Zamanlı Mesajlaşma**
- Socket.IO ile anlık iletişim
- Etkinlik bazlı grup sohbetleri
- Mesaj geçmişi
- Online/offline durumu
- Kalıcı mesaj saklama

### 🎯 **Gelişmiş Etkinlik Yönetimi**
- **Kategoriler:** Spor ⚽, Sanat 🎨, Sosyal ☕
- Kolay etkinlik oluşturma formu
- Katılımcı kapasitesi yönetimi
- Katılım istekleri ve onay sistemi
- Host yönetim paneli
- Bildirim sistemi

### 🔐 **Güvenli ve Hızlı Authentication**
- JWT token tabanlı kimlik doğrulama
- Bcrypt ile şifrelenmiş veriler
- 30 gün otomatik oturum
- AsyncStorage ile güvenli token saklama

---

## 🏗️ Teknoloji Stack

### 📱 **Frontend (Mobile)**
```
React Native 0.81.5
├── Expo ~54.0.30                    # Framework
├── React Navigation 7.x             # Navigation
├── Axios                            # HTTP Client
├── Socket.IO Client                 # Real-time
├── React Native Maps                # Harita
├── Expo Location                    # GPS
├── AsyncStorage                     # Local Storage
├── Zustand                          # State Management
└── React Native Vector Icons        # İkonlar
```

### 🖥️ **Backend (Server)**
```
Node.js + Express
├── MongoDB + Mongoose               # Database
├── Socket.IO                        # WebSocket
├── JWT + Bcrypt                     # Security
├── Joi                             # Validation
├── CORS                            # Cross-origin
└── dotenv                          # Environment
```

---

## 📱 Uygulama Ekranları

| Ekran | Açıklama |
|-------|----------|
| 🔐 **Login/Register** | Kullanıcı girişi ve kayıt formu |
| 🏠 **Home** | Harita + kaydırılabilir etkinlik kartları |
| ➕ **Create Activity** | Yeni etkinlik oluşturma formu |
| 💬 **Chat List** | Aktif sohbet listesi |
| 💭 **Chat** | Gerçek zamanlı mesajlaşma ekranı |
| 👤 **Profile** | Kullanıcı profil bilgileri |

---

## 🚀 Kurulum ve Başlatma

### 📋 Ön Gereksinimler

- **Node.js** v14+ ([İndir](https://nodejs.org/))
- **npm** veya **yarn**
- **Expo CLI** (opsiyonel)
- **MongoDB Atlas** hesabı (veya local MongoDB)
- **iOS/Android Emulator** veya **Expo Go** uygulaması

---

### 🔧 Backend Kurulumu

```bash
# 1. Backend klasörüne gidin
cd backend

# 2. Bağımlılıkları yükleyin
npm install

# 3. .env dosyasını oluşturun
# .env.example dosyasını kopyalayarak .env oluşturun
# MongoDB URI, JWT_SECRET ve PORT ayarlarını yapın

# 4. Backend'i başlatın
npm start
# veya geliştirme modunda:
nodemon index.js
```

**Backend `.env` Örneği:**
```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASS@YOUR_CLUSTER.mongodb.net/sponti
JWT_SECRET=your_randomly_generated_secret_key_here
PORT=3000
```

---

### 📱 Frontend Kurulumu

```bash
# 1. Frontend klasörüne gidin
cd sponti-frontend

# 2. Bağımlılıkları yükleyin
npm install

# 3. Backend URL'lerini güncelleyin
# src/services/api.js dosyasında BASE_URL
# src/screens/ChatScreen.js dosyasında SOCKET_URL
# Kendi bilgisayarınızın IP adresini kullanın (örn: 192.168.1.XXX)

# 4. Uygulamayı başlatın
npm start

# 5. Cihazda açın:
# - Expo Go ile QR kod tarama (fiziksel cihaz)
# - 'a' tuşu: Android Emulator
# - 'i' tuşu: iOS Simulator
```

**IP Adresinizi Öğrenmek İçin:**
```bash
# Windows:
ipconfig

# macOS/Linux:
ifconfig
```

---

## 📚 API Dokümantasyonu

### 🔐 Authentication
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |
| GET | `/api/auth/profile` | Profil bilgisi (Auth) |

### 🎯 Activities
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/activities/nearby?lat=X&lng=Y&dist=10` | Yakındaki etkinlikler |
| POST | `/api/activities` | Yeni etkinlik (Auth) |
| POST | `/api/activities/:id/join` | Katılma isteği (Auth) |
| PUT | `/api/activities/:id/manage-request` | İstek yönetimi (Auth) |
| GET | `/api/activities/incoming-requests` | Bildirimler (Auth) |
| GET | `/api/activities/:id/requests` | Etkinlik istekleri (Auth) |
| GET | `/api/activities/:id/messages` | Mesaj geçmişi (Auth) |

### 💬 Socket Events
```javascript
// Client → Server
socket.emit('join_room', activityId)
socket.emit('send_message', { activityId, senderId, content })

// Server → Client
socket.on('receive_message', messageData)
```

---

## 📂 Proje Yapısı

```
SPONTI-APP/
├── backend/
│   ├── controller/
│   │   ├── activityController.js    # Etkinlik işlemleri
│   │   └── authController.js        # Kimlik doğrulama
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT doğrulama
│   ├── models/
│   │   ├── Activity.js              # Etkinlik şeması
│   │   ├── Message.js               # Mesaj şeması
│   │   └── User.js                  # Kullanıcı şeması
│   ├── routes/
│   │   ├── activityRoutes.js
│   │   └── authRoutes.js
│   ├── .env                         # Environment variables (GİZLİ)
│   ├── .env.example                 # Şablon dosyası
│   ├── .gitignore
│   ├── index.js                     # Server başlangıcı
│   └── package.json
│
└── sponti-frontend/
    ├── src/
    │   ├── screens/
    │   │   ├── HomeScreen.js        # Ana ekran (Harita)
    │   │   ├── LoginScreen.js       # Giriş
    │   │   ├── RegisterScreen.js    # Kayıt
    │   │   ├── CreateActivityScreen.js
    │   │   ├── ChatListScreen.js
    │   │   ├── ChatScreen.js
    │   │   └── ProfileScreen.js
    │   ├── services/
    │   │   └── api.js               # Axios konfigürasyonu
    │   ├── navigation/
    │   │   └── MainNavigator.js
    │   ├── components/
    │   ├── store/
    │   └── assets/
    ├── app.json
    ├── package.json
    └── README.md
```

---

## 🎨 Tasarım Detayları

- **Renk Paleti:** Modern gradientler (mavi-mor tonları)
- **Tipografi:** System fontlar (iOS/Android native)
- **İkonlar:** Expo Vector Icons + Emoji
- **Animasyonlar:** React Native Reanimated
- **UI/UX:** Minimal ve kullanıcı dostu

---

## 🔒 Güvenlik Önlemleri

✅ **Uygulanan Güvenlik Katmanları:**
- JWT token ile stateless authentication
- Bcrypt ile şifre hashleme (10 salt rounds)
- Environment variables ile hassas veri yönetimi
- `.gitignore` ile `.env` dosyalarının korunması
- CORS politikaları
- Input validasyonu (Joi)
- XSS koruması

⚠️ **Production İçin Öneriler:**
- HTTPS kullanımı
- Rate limiting
- Input sanitization
- MongoDB injection koruması
- Helmet.js middleware
- JWT refresh token mekanizması

---

## 🐛 Sorun Giderme

### **Backend bağlanamıyor**
```bash
✓ Backend'in çalıştığını kontrol edin (nodemon index.js)
✓ MongoDB bağlantısının aktif olduğunu doğrulayın
✓ .env dosyasında MONGODB_URI'ın doğru olduğunu kontrol edin
✓ Firewall ayarlarınızı kontrol edin
```

### **Socket bağlantısı kopuyor**
```bash
✓ SOCKET_URL'in doğru IP adresini kullandığından emin olun
✓ Backend CORS ayarlarını kontrol edin (index.js)
✓ Port 3000'in açık olduğunu doğrulayın
```

### **Harita görünmüyor**
```bash
✓ Konum izinlerini verin
✓ GPS'in aktif olduğunu kontrol edin
✓ Google Maps API key kontrolü (gerekirse)
```

### **Login/Register çalışmıyor**
```bash
✓ Network isteklerini kontrol edin (React Native Debugger)
✓ Backend'in /api/auth endpoint'lerinin çalıştığını test edin
✓ Token'ın AsyncStorage'a kaydedildiğini kontrol edin
```

---

## 🚧 Geliştirme Roadmap

### ✅ Tamamlanan Özellikler
- [x] Kullanıcı kimlik doğrulama
- [x] Konum bazlı etkinlik keşfi
- [x] Harita entegrasyonu
- [x] Gerçek zamanlı mesajlaşma
- [x] Katılım istekleri sistemi
- [x] Bildirimler

### 🔜 Gelecek Özellikler
- [ ] Push notification desteği
- [ ] Kullanıcı profil fotoğrafları
- [ ] Etkinlik fotoğrafları
- [ ] Derecelendirme ve yorum sistemi
- [ ] Favori etkinlikler
- [ ] Takvim entegrasyonu
- [ ] Sosyal medya paylaşımı
- [ ] Gelişmiş filtreleme seçenekleri
- [ ] Dark mode desteği
- [ ] Çoklu dil desteği

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları takip edin:

1. Projeyi fork edin
2. Feature branch oluşturun:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Değişikliklerinizi commit edin:
   ```bash
   git commit -m 'Add: Harika özellik eklendi'
   ```
4. Branch'inizi push edin:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Pull Request açın

### Commit Mesaj Formatı
```
Add: Yeni özellik
Fix: Hata düzeltmesi
Update: Güncelleme
Remove: Silme işlemi
Refactor: Kod iyileştirmesi
```

---

## 📄 Lisans

Bu proje özel kullanım içindir. Ticari kullanım için izin alınması gerekmektedir.

---

## 👥 Geliştirici

Sorularınız, önerileriniz veya hata bildirimleri için **Issues** sekmesini kullanabilirsiniz.

---

## 📞 Destek

- 🐛 **Bug Raporu:** [Issues](../../issues) sekmesinden bildirebilirsiniz
- 💡 **Özellik İsteği:** [Issues](../../issues) sekmesinde etiketleyerek önerebilirsiniz
- 📧 **İletişim:** GitHub profili üzerinden

---

<p align="center">
  <strong>SPONTI ile tanımadığınız insanlarla spontane aktiviteler düzenleyin! 🚀</strong>
</p>

<p align="center">
  Made with ❤️ using React Native & Node.js
</p>
