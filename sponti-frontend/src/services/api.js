// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BASE_URL = 'http://192.168.X.XXX:3000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 saniye bekle, cevap yoksa iptal et
});

// Her istekten önce çalışır (Interceptor)
api.interceptors.request.use(
  async (config) => {
    // 1. Telefonda kayıtlı token var mı bak
    const token = await AsyncStorage.getItem('userToken');
    
    // Debug: Token'ı konsola yaz (İşler düzelince bu satırı silebilirsin)
    console.log('📡 API İsteği Gönderiliyor. Token:', token); 

    if (token) {
      // ✅ DÜZELTME BURADA YAPILDI:
      // Backend'in beklediği başlık: 'x-auth-token'
      // Backend "Bearer" kelimesini istemiyor, direkt token'ı veriyoruz.
      config.headers['x-auth-token'] = token; 
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;