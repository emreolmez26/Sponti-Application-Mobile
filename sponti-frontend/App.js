import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranlarımızı import ediyoruz
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MainNavigator from "./src/navigation/MainNavigator";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />

      {/* Sayfa Yığını (Stack) */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Üstteki başlık çubuğunu gizle
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatDetail"
          component={ChatScreen}
          options={{ title: "Sohbet" }} // Header görünsün ki geri dönebilelim
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
