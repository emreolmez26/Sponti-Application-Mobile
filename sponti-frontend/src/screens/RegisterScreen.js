// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView 
} from 'react-native';
import api from '../services/api'; // Garson servisi

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !age) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Backend'e kayıt isteği at
      await api.post('/auth/register', {
        name,
        email,
        password,
        age: Number(age) // Backend sayıyı number olarak bekliyor
      });

      Alert.alert('Başarılı', 'Kayıt oluşturuldu! Giriş yapabilirsin.', [
        { text: 'Tamam', onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Kayıt yapılamadı';
      Alert.alert('Kayıt Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aramıza Katıl 🚀</Text>
      <Text style={styles.subtitle}>Yeni deneyimler seni bekliyor</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adın Soyadın"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Adresin"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Yaşın"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre Belirle"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kayıt Ol</Text>}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')} // Giriş sayfasına geri dön
      >
        <Text style={styles.linkText}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#28a745', // Yeşil Buton (Register için farklı olsun)
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  }
});

export default RegisterScreen;