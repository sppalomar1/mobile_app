import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../supabaseClient';

export default function Receipt() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadReceipt();
  }, []);

  const loadReceipt = async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id;

    const { data: ordersData } = await supabase
      .from('orders')
      .select('menu_items(name), total, created_at')
      .eq('user_id', uid)
      .eq('status', 'paid');

    if (ordersData) {
      setOrders(ordersData);

      const sum = ordersData.reduce((t, o) => t + Number(o.total), 0);
      setTotal(sum);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Successful</Text>
      <Text style={styles.sub}>Thank you for your order!</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Receipt</Text>

        {orders.map((o, i) => (
          <View key={i} style={styles.row}>
            <Text>{o.menu_items.name}</Text>
            <Text>₱{Number(o.total).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>TOTAL PAID</Text>
          <Text style={styles.totalText}>₱{total.toFixed(2)}</Text>
        </View>

        <Text style={styles.thanks}>Payment Method: GCash</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 30, fontWeight: '700', marginBottom: 8 },
  sub: { fontSize: 16, marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: { fontSize: 18, fontWeight: '700' },
  thanks: { marginTop: 15, fontSize: 14, color: 'gray' },
});
