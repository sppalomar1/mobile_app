import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabaseClient';

export default function OrderScreen() {
  const { id } = useLocalSearchParams(); // menu item id
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.log('Error loading item:', error);
    } else {
      setItem(data);
    }
    setLoading(false);
  };

  const placeOrder = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const { error } = await supabase.from('orders').insert({
      menu_id: item.id,
      quantity: 1,
      total: item.price,
      status: 'pending',
      user_id: userId, // <-- link order to user
    });

    if (error) {
      console.log('Insert order error:', error);
      Alert.alert('Error', 'Failed to place order');
    } else {
      Alert.alert('Success', 'Order placed!');
      router.push('/orders'); // go to orders screen
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!item) return <Text>Item not found</Text>;

  return (
    <View style={styles.container}>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.img} />}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₱{item.price}</Text>

      <TouchableOpacity style={styles.btn} onPress={placeOrder}>
        <Text style={styles.btnText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  img: { width: '100%', height: 220, borderRadius: 10 },
  name: { fontSize: 24, marginVertical: 10, fontWeight: 'bold' },
  price: { fontSize: 20, color: 'green' },
  btn: { backgroundColor: '#ff6600', padding: 15, borderRadius: 8, marginTop: 20 },
  btnText: { color: 'white', fontSize: 18, textAlign: 'center' },
});
