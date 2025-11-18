import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="menu" options={{ title: 'Menu' }} />
      <Stack.Screen name="addMenuItem" options={{ title: 'Add Menu Item' }} />
      <Stack.Screen name="order" options={{ title: 'Place Order' }} />
      <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
      
    </Stack>
  );
}
