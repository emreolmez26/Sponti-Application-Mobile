# SPONTI - Spontane Etkinlik Buluşma Uygulaması 🎉

**SPONTI**, anlık aktivite planlamak ve yakınındaki insanlarla buluşmak için geliştirilmiş sosyal bir mobil uygulamadır. Spor, sanat, kahve sohbeti gibi kategorilerde etkinlikler oluşturun, yakınınızdaki etkinlikleri keşfedin ve gerçek zamanlı sohbet ile iletişim kurun!

## 🌟 Özellikler

### 📍 Konum Bazlı Keşif
- Gerçek zamanlı konum servisi ile 10 km çapındaki etkinlikleri görün
- Harita üzerinde interaktif etkinlik keşfi
- Her etkinlik için mesafe bilgisi

### 🗺️ İnteraktif Harita
- React Native Maps ile güçlendirilmiş harita görünümü
- Etkinlik marker'ları ile kolay gezinme
- Kart kaydırma ile harita senkronizasyonu

### 💬 Gerçek Zamanlı Mesajlaşma
- Socket.IO ile anlık mesajlaşma
- Etkinlik bazlı sohbet odaları
- Mesaj geçmişi ve kalıcı saklama

### 🎯 Etkinlik Yönetimi
- Etkinlik oluşturma (Spor, Sanat, Sosyal)
- Katılım istekleri ve onay sistemi
- Host/Katılımcı yönetim paneli
- Bildirim sistemi

### 🔐 Güvenli Kimlik Doğrulama
- JWT token tabanlı authentication
- AsyncStorage ile güvenli token saklama
- Şifrelenmiş kullanıcı bilgileri

## 🛠️ Teknoloji Stack

### Frontend
- **Framework:** React Native + Expo
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **State Management:** Zustand
- **API İletişimi:** Axios
- **Harita:** React Native Maps
- **Konum:** Expo Location
- **Real-time:** Socket.IO Client
- **Storage:** AsyncStorage

### Backend Integration
- Node.js + Express REST API
- Socket.IO gerçek zamanlı mesajlaşma
- JWT authentication
- MongoDB veritabanı

## 📱 Ekranlar

1. **Login/Register Screen** - Kullanıcı girişi ve kayıt
2. **Home Screen** - Harita ve etkinlik kartları
3. **Create Activity Screen** - Yeni etkinlik oluşturma
4. **Chat List Screen** - Aktif sohbetler
5. **Chat Screen** - Gerçek zamanlı mesajlaşma
6. **Profile Screen** - Kullanıcı profili

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js (v14 veya üzeri)
- Expo CLI
- iOS Simulator veya Android Emulator (opsiyonel)
- Expo Go uygulaması (fiziksel cihaz için)

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Backend URL'ini ayarlayın:**
   - `src/services/api.js` dosyasındaki `BASE_URL` değerini güncelleyin
   - `src/screens/ChatScreen.js` dosyasındaki `SOCKET_URL` değerini güncelleyin
   - Backend'inizin IP adresini kullanın (örn: `192.168.1.XXX:3000`)

3. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

4. **Cihazda çalıştırın:**
   - Expo Go uygulamasıyla QR kodu tarayın (fiziksel cihaz)
   - `a` tuşuna basın (Android Emulator)
   - `i` tuşuna basın (iOS Simulator)

## 🔧 Yapılandırma

### API Endpoints
Uygulama şu backend endpoint'lerini kullanır:
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Profil bilgisi
- `GET /api/activities/nearby` - Yakındaki etkinlikler
- `POST /api/activities` - Etkinlik oluşturma
- `POST /api/activities/:id/join` - Etkinliğe katılma isteği
- `PUT /api/activities/:id/manage-request` - İstek yönetimi
- `GET /api/activities/incoming-requests` - Bildirimler

### Socket Events
- `join_room` - Sohbet odasına katılma
- `send_message` - Mesaj gönderme
- `receive_message` - Mesaj alma

## 📂 Proje Yapısı

```
sponti-frontend/
├── src/
│   ├── screens/           # Uygulama ekranları
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── CreateActivityScreen.js
│   │   ├── ChatListScreen.js
│   │   ├── ChatScreen.js
│   │   └── ProfileScreen.js
│   ├── services/          # API servisleri
│   │   └── api.js
│   ├── navigation/        # Navigation yapısı
│   │   └── MainNavigator.js
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   ├── store/            # State management
│   └── assets/           # Görseller, fontlar
├── app.json              # Expo konfigürasyonu
└── package.json

```

## 🎨 Tasarım Özellikleri

- Modern ve minimal kullanıcı arayüzü
- Gradient arka planlar ve yumuşak renkler
- Responsive tasarım
- Smooth animasyonlar
- Kullanıcı dostu bildirimler

## 🔒 Güvenlik

- JWT token ile güvenli authentication
- Token otomatik yenileme (30 gün)
- Hassas veriler AsyncStorage'da şifreli
- HTTPS bağlantı desteği (production için)

## 🐛 Bilinen Sorunlar ve Çözümler

### Backend Bağlantı Hatası
- Backend'in çalıştığından emin olun
- IP adresinin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### Socket Bağlantı Kopması
- Backend CORS ayarlarını kontrol edin
- Socket URL'in doğru olduğundan emin olun

### Harita Görünmüyor
- Google Maps API key'inin geçerli olduğunu kontrol edin
- Konum izinlerinin verildiğinden emin olun

## 📝 Geliştirme Notları

### Debug Modunda
- API istekleri konsola loglanır
- Token bilgisi görüntülenir
- Detaylı hata mesajları

### Production Build
- Debug console.log'ları kaldırın
- API URL'leri environment variable'a taşıyın
- Maps API key'ini güvenli şekilde saklayın

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje özel kullanım içindir.

## 📞 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

**SPONTI ile tanımadığınız insanlarla spontane aktiviteler düzenleyin! 🚀**

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
