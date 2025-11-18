import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabaseClient';

// --- Type definitions ---
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
  menu_items: MenuItem | null; // Could be null if relation is empty
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
      // Supabase returns `menu_items` as array if it's a relationship, pick first item
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
    const currentQty = order.quantity.toString();
    const menuItem = order.menu_items;
    if (!menuItem) return;

    Alert.prompt(
      'Edit Order',
      `Change quantity for ${menuItem.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (qtyStr: string | undefined) => {
            if (!qtyStr) return;
            const qty = Number(qtyStr);
            if (isNaN(qty) || qty <= 0) return Alert.alert('Invalid quantity');

            supabase
              .from('orders')
              .update({ quantity: qty, total: qty * menuItem.price })
              .eq('id', order.id)
              .then(({ error }) => {
                if (error) Alert.alert('Error', 'Failed to update order: ' + error.message);
                else fetchOrders(userId!);
              });
          },
        },
      ],
      'plain-text',
      currentQty
    );
  };

  const deleteOrder = (orderId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this order?',
      [
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
                if (error) Alert.alert('Error', 'Failed to delete order: ' + error.message);
                else fetchOrders(userId!);
              });
          },
        },
      ]
    );
  };

  const goToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: '700' }}>{item.menu_items?.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>₱{Number(item.total).toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>{new Date(item.created_at).toLocaleString()}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => editOrder(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteOrder(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {orders.length > 0 && (
        <TouchableOpacity style={styles.checkoutBtn} onPress={goToCheckout}>
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
        </TouchableOpacity>
      )}

      {orders.length === 0 && <Text>No orders yet.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  editBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  checkoutBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  checkoutText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
