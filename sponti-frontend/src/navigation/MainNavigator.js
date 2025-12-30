// src/navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için

// Ekranları çağır
import HomeScreen from '../screens/HomeScreen';
import CreateActivityScreen from '../screens/CreateActivityScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Üstteki başlığı gizle
        tabBarActiveTintColor: '#007AFF', // Aktif sekme rengi
        tabBarInactiveTintColor: 'gray', // Pasif renk
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Harita' }} />
      <Tab.Screen name="Create" component={CreateActivityScreen} options={{ title: 'Oluştur' }} />
      <Tab.Screen name="Chat" component={ChatListScreen} options={{ title: 'Sohbet' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default MainNavigator;