import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../supabaseClient';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
};

export default function OrderScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) console.log('Error loading item:', error);
    else setItem(data);

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
      menu_id: item?.id,
      quantity: quantity,
      total: (item?.price || 0) * quantity,
      status: 'pending',
      user_id: userId,
    });

    if (error) {
      Alert.alert('Error', 'Failed to place order');
    } else {
      Alert.alert('Success', 'Order placed!');
      router.push('/customer/orders');
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!item) return <Text>Item not found</Text>;

  return (
    <View style={styles.container}>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Floating Card */}
      <View style={styles.card}>
        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.img} />
        )}

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₱ {item.price}</Text>

        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}

        {/* Quantity Selector */}
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyNumber}>{quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
          <Text style={styles.orderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    padding: 20,
  },

  backBtn: {
    marginTop: 10,
    marginBottom: 10,
  },
  backText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginTop: 10,
    elevation: 4,
  },

  img: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 15,
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 5,
  },
  price: {
    fontSize: 22,
    color: "#6D4B2F",
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    color: "#444",
    fontSize: 15,
    marginBottom: 20,
  },

  quantityRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  qtyBtn: {
    backgroundColor: "#B37044",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  qtyNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 20,
  },

  orderBtn: {
    backgroundColor: "#6D4B2F",
    paddingVertical: 14,
    borderRadius: 25,
  },
  orderText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
