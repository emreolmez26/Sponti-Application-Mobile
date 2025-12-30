import React, { useState, useCallback, useRef } from 'react';
import { 
  View, StyleSheet, Text, ActivityIndicator, Alert, Modal, TouchableOpacity, 
  FlatList, Dimensions, Platform, ScrollView 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // Kart genişliği
const SPACING = 10;

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Referanslar
  const mapRef = useRef(null);
  const flatListRef = useRef(null);

  // Detay Modalı State'leri
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Bildirim ve Kullanıcı State'leri
  const [myUserId, setMyUserId] = useState(null);
  const [notifications, setNotifications] = useState([]); 
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  
  // Spesifik Bir Etkinliğin İsteklerini Yönetmek İçin (Opsiyonel)
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);
  const [currentActivityRequests, setCurrentActivityRequests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        // 1. Konum İzni ve Alma
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLoading(false);
            return;
        }
        
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        // 2. Profil ve Bildirimleri Çek
        try {
            const profile = await api.get('/auth/profile');
            setMyUserId(profile.data._id);
            fetchNotifications(); 
        } catch (_e) { 
            console.log("Profil çekilemedi");
        }

        // 3. Etkinlikleri Getir
        fetchActivities(loc);
      })();
    }, [])
  );

  // --- API ÇAĞRILARI ---

  const fetchActivities = async (loc) => {
    if (!loc) return;
    try {
      // 10 km çapındaki etkinlikleri getir
      const response = await api.get(
        `/activities/nearby?lat=${loc.coords.latitude}&lng=${loc.coords.longitude}&dist=10`
      );
      setActivities(response.data);
      setLoading(false);
    } catch (error) { 
        console.error("Etkinlik hatası:", error);
        setLoading(false); 
    }
  };

  const fetchNotifications = async () => {
    try {
        const res = await api.get('/activities/incoming-requests');
        setNotifications(res.data);
    } catch (_error) {
        console.log("Bildirim hatası");
    }
  };

  // Belirli bir etkinlik için istekleri çek (Host yönetim paneli için)
  const fetchRequestsForActivity = async (activityId) => {
      try {
          const res = await api.get(`/activities/${activityId}/requests`);
          setCurrentActivityRequests(res.data);
          setRequestsModalVisible(true);
      } catch (_error) {
          Alert.alert("Hata", "İstekler alınamadı.");
      }
  };

  // --- İŞLEM FONKSİYONLARI ---

  const handleJoin = async () => {
    if (!selectedActivity) return;
    try {
      await api.post(`/activities/${selectedActivity._id}/join`);
      Alert.alert("Başarılı 🎉", "İstek gönderildi! Host onaylayınca sohbete düşeceksin.");
      setModalVisible(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Bir hata oluştu";
      Alert.alert("Hata", msg);
    }
  };

  const handleDecision = async (activityId, userId, status) => {
    try {
      await api.put(`/activities/${activityId}/manage-request`, {
        userId,
        status // 'accepted' veya 'rejected'
      });
      
      // 1. Bildirim listesinden sil
      setNotifications(prev => prev.filter(n => !(n.activityId === activityId && n.user._id === userId)));
      
      // 2. Eğer o an spesifik yönetim ekranı açıksa oradan da sil
      setCurrentActivityRequests(prev => prev.filter(u => u.user._id !== userId));

      Alert.alert("İşlem Tamam", `Kullanıcı ${status === 'accepted' ? 'onaylandı' : 'reddedildi'}.`);
    } catch (_error) {
      Alert.alert("Hata", "İşlem yapılamadı");
    }
  };

  // --- YARDIMCI FONKSİYONLAR ---

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const onScrollToIndex = (index) => {
    const activity = activities[index];
    if (activity && mapRef.current) {
        mapRef.current.animateToRegion({
            latitude: activity.location.coordinates[1],
            longitude: activity.location.coordinates[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    }
  };

  const onMarkerPress = (index) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // Helper: Host muyum?
  const isHost = (activity) => {
      return activity && myUserId && (activity.host._id === myUserId || activity.host === myUserId);
  };

  // --- RENDER CARD (CAROUSEL ITEM) ---
  const renderCard = ({ item }) => {
    const dist = location ? getDistance(
        location.coords.latitude, location.coords.longitude,
        item.location.coordinates[1], item.location.coordinates[0]
    ) : "?";

    return (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => {
                setSelectedActivity(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.cardImagePlaceholder}>
                <Text style={{fontSize: 30}}>
                    {item.category === 'Spor' ? '⚽' : item.category === 'Sanat' ? '🎨' : '☕'}
                </Text>
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardDist}>📍 {dist} km uzakta</Text>
                <Text style={styles.cardTime}>
                    📅 {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardParticipants}>👥 {item.participants.length}/{item.capacity || 4}</Text>
                    <View style={styles.btnSmall}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:12}}>İncele</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
  };

  if (loading || !location) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF"/></View>;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
      >
        {activities.map((activity, index) => (
          <Marker
            key={activity._id}
            coordinate={{
              latitude: activity.location.coordinates[1], 
              longitude: activity.location.coordinates[0],
            }}
            onPress={() => onMarkerPress(index)}
          >
            <View style={[styles.markerContainer, isHost(activity) && styles.myMarker]}>
               <Text style={styles.markerText}>
                 {isHost(activity) ? '👑' : '📍'}
               </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* --- CAROUSEL LİSTESİ --- */}
      {activities.length > 0 && (
          <View style={styles.carouselContainer}>
              <FlatList
                ref={flatListRef}
                data={activities}
                renderItem={renderCard}
                keyExtractor={(item) => item._id}
                horizontal
                pagingEnabled
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
                getItemLayout={(data, index) => (
                    { length: CARD_WIDTH + SPACING, offset: (CARD_WIDTH + SPACING) * index, index }
                )}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
                    onScrollToIndex(index);
                }}
              />
          </View>
      )}

      {/* --- BİLDİRİM ZİLİ --- */}
      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={() => {
            fetchNotifications();
            setNotificationModalVisible(true);
        }}
      >
        <Text style={{fontSize: 24}}>🔔</Text>
        {notifications.length > 0 && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
        )}
      </TouchableOpacity>

      {/* --- 1. DETAY MODALI --- */}
      {selectedActivity && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                <View style={styles.headerRow}>
                  <View style={styles.dragBar} />
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{selectedActivity.title}</Text>
                <Text style={styles.hostText}>
                    Düzenleyen: {isHost(selectedActivity) ? "Sen (Host)" : (selectedActivity.host?.name || "Bilinmiyor")}
                </Text>
                <Text style={styles.modalDesc}>{selectedActivity.description}</Text>
                
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>📅 {new Date(selectedActivity.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  <Text style={styles.metaText}>👥 {selectedActivity.participants.length}/{selectedActivity.capacity || 4} Kişi</Text>
                </View>

                {isHost(selectedActivity) ? (
                    <TouchableOpacity 
                        style={[styles.joinButton, { backgroundColor: '#FF9500' }]} 
                        onPress={() => {
                            setModalVisible(false); // Detayı kapat
                            fetchRequestsForActivity(selectedActivity._id); // Yönetimi aç
                        }}
                    >
                        <Text style={styles.joinButtonText}>📋 Başvuruları Yönet</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
                        <Text style={styles.joinButtonText}>Katıl (İstek Gönder) 🚀</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* --- 2. GENEL BİLDİRİM MODALI (ZİL) --- */}
      <Modal animationType="fade" transparent={true} visible={notificationModalVisible} onRequestClose={() => setNotificationModalVisible(false)}>
        <View style={styles.notifOverlay}>
            <View style={styles.notifContent}>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:15}}>
                    <Text style={styles.notifTitle}>Gelen İstekler 📬</Text>
                    <TouchableOpacity onPress={() => setNotificationModalVisible(false)}><Text style={{fontSize:20}}>✕</Text></TouchableOpacity>
                </View>
                {notifications.length === 0 ? (
                    <Text style={{textAlign:'center', color:'#999', padding:20}}>Bekleyen istek yok.</Text>
                ) : (
                    <ScrollView style={{maxHeight: 400}}>
                        {notifications.map((notif) => (
                            <View key={notif._id} style={styles.notifItem}>
                                <View style={{flex:1}}>
                                    <Text style={styles.notifUser}>{notif.user?.name || "İsimsiz"}</Text>
                                    <Text style={styles.notifActivity}>Etkinlik: {notif.activityTitle}</Text>
                                </View>
                                <View style={styles.notifActions}>
                                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#ffebee'}]} onPress={() => handleDecision(notif.activityId, notif.user._id, 'rejected')}><Text>❌</Text></TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#e8f5e9'}]} onPress={() => handleDecision(notif.activityId, notif.user._id, 'accepted')}><Text>✅</Text></TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
      </Modal>

      {/* --- 3. SPESİFİK ETKİNLİK YÖNETİM MODALI --- */}
      <Modal animationType="fade" transparent={true} visible={requestsModalVisible} onRequestClose={() => setRequestsModalVisible(false)}>
        <View style={styles.notifOverlay}>
            <View style={styles.notifContent}>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:15}}>
                    <Text style={styles.notifTitle}>Bu Etkinlik İçin İstekler</Text>
                    <TouchableOpacity onPress={() => setRequestsModalVisible(false)}><Text style={{fontSize:20}}>✕</Text></TouchableOpacity>
                </View>
                {currentActivityRequests.length === 0 ? (
                    <Text style={{textAlign:'center', color:'#999', padding:20}}>Bu etkinlik için bekleyen yok.</Text>
                ) : (
                    <ScrollView>
                        {currentActivityRequests.map((reqItem) => (
                            <View key={reqItem.user._id} style={styles.notifItem}>
                                <Text style={styles.notifUser}>{reqItem.user?.name}</Text>
                                <View style={styles.notifActions}>
                                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#ffebee'}]} onPress={() => handleDecision(selectedActivity._id, reqItem.user._id, 'rejected')}><Text>❌</Text></TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#e8f5e9'}]} onPress={() => handleDecision(selectedActivity._id, reqItem.user._id, 'accepted')}><Text>✅</Text></TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  center: {flex:1, justifyContent:'center', alignItems:'center'},
  
  markerContainer: { backgroundColor: 'white', padding: 5, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', elevation: 5 },
  myMarker: { borderColor: '#FF9500', borderWidth: 2 },
  markerText: { fontSize: 24 },

  carouselContainer: { position: 'absolute', bottom: 30, width: '100%', height: 140 },
  card: { backgroundColor: 'white', width: CARD_WIDTH, height: '100%', marginHorizontal: SPACING / 2, borderRadius: 15, flexDirection: 'row', padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 5 },
  cardImagePlaceholder: { width: 80, height: '100%', backgroundColor: '#f0f8ff', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1, justifyContent: 'space-between', paddingVertical: 5 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  cardDist: { fontSize: 12, color: '#666' },
  cardTime: { fontSize: 12, color: '#007AFF', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardParticipants: { fontSize: 12, color: '#999' },
  btnSmall: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },

  // Bildirim Butonu
  notificationButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, backgroundColor: 'white', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", elevation: 10, zIndex: 999 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Modal Ortak Stilleri
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, paddingBottom: 40, minHeight: 320, elevation: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15, position: 'relative' },
  dragBar: { width: 50, height: 5, backgroundColor: '#e0e0e0', borderRadius: 10, alignSelf: 'center' },
  closeButton: { position: 'absolute', right: 0, top: -10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 20 },
  closeButtonText: { fontSize: 16, fontWeight: 'bold' },
  modalTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  hostText: { color: '#666', fontStyle: 'italic', marginBottom: 15 },
  modalDesc: { fontSize: 16, color: '#444', marginBottom: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10 },
  metaText: { fontSize: 15, color: '#007AFF', fontWeight: '600' },
  joinButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center' },
  joinButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Bildirim Modal İçeriği
  notifOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  notifContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: '70%', elevation: 10 },
  notifTitle: { fontSize: 20, fontWeight: 'bold' },
  notifItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  notifUser: { fontSize: 16, fontWeight: 'bold' },
  notifActivity: { fontSize: 14, color: '#666', marginTop: 2 },
  notifActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;