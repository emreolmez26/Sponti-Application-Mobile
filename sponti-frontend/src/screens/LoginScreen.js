// src/screens/auth/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api"; // Yazdığımız "Garson" servisi

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Basit doğrulama
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    try {
      // 2. Backend'e istek at (Garsonu gönder)
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      // 3. Başarılıysa Token'ı telefona kaydet
      const { token, user } = response.data;
      await AsyncStorage.setItem("userToken", token);

      Alert.alert('Başarılı', `Hoşgeldin ${user.name}!`, [
        { 
          text: 'Haritaya Git', 
          onPress: () => navigation.replace('Main') // navigate yerine 'replace' kullandık ki geri butonuna basınca tekrar login'e dönemesin.
        }
      ]);

      // (Normalde burada Ana Sayfaya yönlendireceğiz, şimdilik sadece alert veriyoruz)
    } catch (error) {
      // 4. Hata varsa kullanıcıya söyle
      console.error(error);
      const errorMessage = error.response?.data?.message || "Giriş yapılamadı";
      Alert.alert("Giriş Hatası", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SPONTI</Text>
      <Text style={styles.subtitle}>Tekrar Hoşgeldiniz!</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Adresiniz"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Şifreyi yıldızlı gösterir
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Yüklenirken tıklamayı engelle
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Register")} // <--- BU SATIRI EKLE
      >
        <Text style={styles.linkText}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

// Basit ve Temiz Tasarım (Stiller)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF", // Mavi Buton
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default LoginScreen;
