import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';


const SOCKET_URL = 'http://192.168.X.XXX:3000'; 

const ChatScreen = ({ route, navigation }) => {
  const { activityId, title } = route.params; // Listeden gelen bilgiler
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  // 1. Başlangıç Ayarları (User ID al ve Eski Mesajları Çek)
  useEffect(() => {
    navigation.setOptions({ title: title }); // Üst başlığı ayarla

    const init = async () => {
      // a. Kendi ID'mizi bulalım (Mesaj sağda mı solda mı duracak?)
      const token = await AsyncStorage.getItem('userToken');
      // Basit bir yöntem: Token'dan ID çözmek yerine backend'den "whoami" endpoint'i yapılabilir
      // Şimdilik token'ı decode etmek zor olduğu için, backend'den ID dönen ufak bir fetch yapabilirsin.
      // Ya da decode edilmiş token'ı saklıyorsan oradan al.
      // GEÇİCİ ÇÖZÜM: İlk mesaj attığında ID'yi state'e atarız veya api çağrısıyla profilimizi çekeriz.
      try {
         const profile = await api.get('/auth/profile'); // Eğer böyle bir rotan varsa
         setUserId(profile.data._id);
      } catch (e) {
         console.log("Profil alınamadı");
      }

      // b. Eski mesajları getir
      try {
        const res = await api.get(`/activities/${activityId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.log("Mesaj geçmişi alınamadı", err);
      }
    };

    init();

    // 2. Socket Bağlantısını Kur
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Odaya Katıl
    newSocket.emit('join_room', activityId);
    console.log(`Odaya girildi: ${activityId}`);

    // Mesaj Gelince Listeye Ekle
    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
      // Listeyi en aşağı kaydır
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    });

    // Sayfadan çıkınca bağlantıyı kes
    return () => newSocket.disconnect();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Backend'e gönderilecek veri
    const messageData = {
      activityId,
      senderId: userId, // Profil API'den gelen ID
      content: inputText,
    };

    // 1. Soket ile anında gönder (Herkes görsün)
    socket.emit('send_message', messageData);

    // 2. Inputu temizle
    setInputText('');
  };

  const renderItem = ({ item }) => {
    const isMyMessage = item.sender._id === userId || item.sender === userId;
    
    return (
      <View style={[
        styles.messageBubble, 
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        {!isMyMessage && <Text style={styles.senderName}>{item.sender.name}</Text>}
        <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.otherText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90} // Header yüksekliği kadar
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()} // Klavye açılınca kaydır
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yaz..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>🚀</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  listContent: { padding: 15, paddingBottom: 20 },
  
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
  },
  senderName: { fontSize: 10, color: '#999', marginBottom: 2 },
  messageText: { fontSize: 16 },
  myText: { color: '#fff' },
  otherText: { color: '#333' },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendText: { fontSize: 18, color: 'white' }
});

export default ChatScreen;