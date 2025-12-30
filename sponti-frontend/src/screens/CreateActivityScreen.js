import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api'; 

const CreateActivityScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coffee'); // Varsayılan kategori
  const [capacity, setCapacity] = useState('4');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sayfa açılınca konumu bul
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Hata', 'Etkinlik oluşturmak için konum izni şart.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleCreate = async () => {
    if (!title || !description || !location) {
      Alert.alert('Eksik Bilgi', 'Lütfen başlık, açıklama girin ve konumun bulunmasını bekleyin.');
      return;
    }

    setLoading(true);

    try {
      // Backend ile %100 Uyumlu Payload
      const payload = {
        title: title,
        description: description,
        category: category,
        
        // DÜZELTME 1: Backend 'time' istiyor, biz 'date' gönderiyorduk.
        time: new Date().toISOString(), 
        
        // Backend şemanda capacity varsa gönder, yoksa silebilirsin.
        // Ama time ve location zorunlu.
        
        location: {
          // DÜZELTME 2: Backend location.coordinates ve location.addressName bekliyor
          coordinates: [location.longitude, location.latitude], 
          addressName: "Seçilen Konum" // Backend bunu da bekliyor
        }
      };

      // Debug için konsola basıp kontrol edebilirsin
      console.log("Giden Veri:", payload);
      
      await api.post('/activities', payload);

      Alert.alert('Başarılı', 'Etkinlik oluşturuldu!', [
        { text: 'Haritada Gör', onPress: () => navigation.navigate('Home') }
      ]);

      // Formu temizle
      setTitle('');
      setDescription('');

    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Etkinlik oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  // Kategori Seçim Butonu Bileşeni
  const CategoryButton = ({ value, label }) => (
    <TouchableOpacity 
      style={[styles.catButton, category === value && styles.catButtonActive]}
      onPress={() => setCategory(value)}
    >
      <Text style={[styles.catText, category === value && styles.catTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni Etkinlik 📍</Text>

      <Text style={styles.label}>Başlık</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Örn: Akşam Kahvesi" 
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="Detayları yaz..." 
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Kişi Sayısı</Text>
      <TextInput 
        style={styles.input} 
        placeholder="4" 
        keyboardType="numeric"
        value={capacity}
        onChangeText={setCapacity}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.categoryRow}>
        <CategoryButton value="coffee" label="☕ Kahve" />
        <CategoryButton value="food" label="🍔 Yemek" />
        <CategoryButton value="cinema" label="🎬 Sinema" />
        <CategoryButton value="game" label="🎮 Oyun" />
      </View>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Oluştur ve Yayınla</Text>
        )}
      </TouchableOpacity>

      {/* Konum Durumu Bilgilendirmesi */}
      <Text style={styles.locationStatus}>
        {location ? '✅ Konumun alındı' : '📍 Konum aranıyor...'}
      </Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#555' },
  input: { 
    backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', 
    padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 10 },
  catButton: { 
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, 
    backgroundColor: '#eee', marginBottom: 5 
  },
  catButtonActive: { backgroundColor: '#007AFF' },
  catText: { color: '#333', fontWeight: 'bold' },
  catTextActive: { color: '#fff' },
  createButton: { 
    backgroundColor: '#007AFF', padding: 18, borderRadius: 15, 
    alignItems: 'center', marginTop: 10 
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  locationStatus: { textAlign: 'center', marginTop: 15, color: '#999', fontSize: 12 }
});

export default CreateActivityScreen;