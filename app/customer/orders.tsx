import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  quantity: number;
  total: number;
  status: string;
  created_at: string;
  menu_items: MenuItem | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data?.user?.id ?? null;
      setUserId(id);
      if (id) fetchOrders(id);
    };
    initialize();
  }, []);

  const fetchOrders = async (uid: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, quantity, total, status, created_at, menu_items(id, name, price)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) console.log('Fetch orders error:', error);
    else {
      const formatted = (data || []).map((o: any): Order => ({
        id: o.id,
        quantity: o.quantity,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
        menu_items: o.menu_items?.[0] ?? null,
      }));
      setOrders(formatted);
    }
  };

  const editOrder = (order: Order) => {
    const menuItem = order.menu_items;
    if (!menuItem) return;

    Alert.prompt(
      'Edit Quantity',
      `Change quantity for ${menuItem.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (qtyStr: string | undefined) => {
            if (!qtyStr) return;
            const qty = Number(qtyStr);
            if (isNaN(qty) || qty <= 0) {
              Alert.alert('Invalid quantity');
              return;
            }

            supabase
              .from('orders')
              .update({ quantity: qty, total: qty * menuItem.price })
              .eq('id', order.id)
              .then(({ error }) => {
                if (error) Alert.alert('Error', error.message);
                else fetchOrders(userId!);
              });
          },
        },
      ],
      'plain-text',
      order.quantity.toString()
    );
  };

  const deleteOrder = (orderId: string) => {
    Alert.alert('Confirm Delete', 'Delete this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          supabase
            .from('orders')
            .delete()
            .eq('id', orderId)
            .then(({ error }) => {
              if (error) Alert.alert('Error', error.message);
              else fetchOrders(userId!);
            });
        },
      },
    ]);
  };

  const goToCheckout = () => {
    router.push('/customer/checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.menu_items?.name}</Text>
            <Text style={styles.info}>Qty: {item.quantity}</Text>
            <Text style={styles.info}>Total: ₱{item.total.toFixed(2)}</Text>
            <Text style={styles.info}>Status: {item.status}</Text>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleString()}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => editOrder(item)}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteOrder(item.id)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* CHECKOUT BUTTON (Only if orders exist) */}
      {orders.length > 0 && (
        <TouchableOpacity style={styles.checkoutBtn} onPress={goToCheckout}>
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      )}

      {orders.length === 0 && (
        <Text style={styles.empty}>No orders yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    padding: 16,
  },

  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 4,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },

  info: {
    fontSize: 16,
    color: "#555",
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "flex-end",
    gap: 10,
  },

  editBtn: {
    backgroundColor: "#B37044",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },

  deleteBtn: {
    backgroundColor: "#6D4B2F",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },

  btnText: {
    color: "white",
    fontWeight: "700",
  },

  empty: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },

  /* NEW CHECKOUT BUTTON */
  checkoutBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#6D4B2F",
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 5,
  },

  checkoutText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
