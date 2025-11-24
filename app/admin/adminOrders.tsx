import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  user_id: string;
  users: { email: string } | null;
  menu_items: MenuItem | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, quantity, total, status, created_at, user_id,
        users(email),
        menu_items(id, name, price)
      `)
      .order('created_at', { ascending: false });

    if (error) console.log('Fetch error:', error);
    else {
      const formatted = (data || []).map((o: any): Order => ({
        id: o.id,
        quantity: o.quantity,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
        user_id: o.user_id,
        users: o.users ?? null,
        menu_items: o.menu_items?.[0] ?? null,
      }));
      setOrders(formatted);
    }
  };

  const markDone = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Done' })
      .eq('id', orderId);

    if (error) Alert.alert('Error', 'Failed to update status');
    else fetchAllOrders();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>All Orders (Admin)</Text>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.users?.email ?? 'Unknown user'}</Text>

            <Text style={styles.itemName}>{item.menu_items?.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>Total: ₱{Number(item.total).toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>{new Date(item.created_at).toLocaleString()}</Text>

            {item.status !== 'Done' && (
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => markDone(item.id)}
              >
                <Text style={styles.doneText}>Mark as Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {orders.length === 0 && <Text>No orders yet.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  email: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  doneBtn: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  doneText: {
    color: 'white',
    fontWeight: '700',
  },
});
 