import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Ionicons 
                name="home" 
                size={size} 
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "",
            tabBarIcon: ({ color, size }) => (
              <Ionicons 
                name="heart" 
                size={size} 
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
