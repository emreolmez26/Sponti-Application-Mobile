import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfaya her gelindiğinde verileri çek
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      // Backend'e "Ben kimim?" diye soruyoruz
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Uygulamadan çıkmak istediğine emin misin?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          style: "destructive",
          onPress: async () => {
            // Token'ı telefondan sil
            await AsyncStorage.removeItem('userToken');
            // Login ekranına gönder ve geçmişi sil (Geri tuşu çalışmasın)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Kısım: Avatar ve İsim */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || "Kullanıcı"}</Text>
        <Text style={styles.email}>{user?.email || "email@yok.com"}</Text>
      </View>

      {/* İstatistikler (Şimdilik Statik, sonra bağlayabiliriz) */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Arkadaş</Text>
        </View>
      </View>

      {/* Menü Butonları */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Yakında", "Ayarlar yakında eklenecek!")}>
          <Text style={styles.menuText}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Yakında", "Profil düzenleme yakında!")}>
          <Text style={styles.menuText}>✏️ Profili Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>v1.0.0 - SPONTI</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
  },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4, borderColor: '#fff',
    elevation: 5
  },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 5 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#999' },
  statDivider: { width: 1, height: '100%', backgroundColor: '#eee' },

  menu: { paddingHorizontal: 20 },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  
  logoutButton: { marginTop: 20, borderBottomWidth: 0 },
  logoutText: { color: 'red', fontWeight: 'bold' },

  version: { textAlign: 'center', marginTop: 40, color: '#ccc', fontSize: 12 }
});

export default ProfileScreen;