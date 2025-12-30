import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfaya her gelindiğinde listeyi yenile
  useFocusEffect(
    useCallback(() => {
      fetchMyActivities();
    }, [])
  );

  const fetchMyActivities = async () => {
    try {
      const response = await api.get('/activities/my-activities');
      setChats(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      // Buraya daha sonra "Mesajlaşma Ekranına Git" kodunu yazdık.
    onPress={() => navigation.navigate('ChatDetail', { 
      activityId: item._id, 
      title: item.title 
    })}
    >
      {/* Profil Resmi Yerine Baş Harf Yuvarlağı */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.title.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>
            {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Sohbetler 💬</Text>
      
      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz bir etkinliğin yok.</Text>
          <Text style={styles.subText}>Haritadan bir etkinliğe katıl veya yeni oluştur!</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchMyActivities} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 20, color: '#333' },
  
  listContent: { paddingHorizontal: 20 },
  
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  
  chatInfo: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 12, color: '#999' },
  lastMessage: { fontSize: 14, color: '#666' },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: '#999', marginTop: 5 },
});

export default ChatListScreen;