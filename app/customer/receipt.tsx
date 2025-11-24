import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabaseClient';

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
            <Text style={styles.itemName}>{o.menu_items.name}</Text>
            <Text style={styles.amount}>₱{Number(o.total).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>TOTAL PAID</Text>
          <Text style={styles.totalText}>₱{total.toFixed(2)}</Text>
        </View>

        <Text style={styles.method}>Payment Method: GCash</Text>
      </View>

      {/* BACK TO Menu BUTTON */}
      <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/customer/menu')}>
        <Text style={styles.homeText}>BACK TO MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    padding: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },

  sub: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#6D4B2F",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },

  amount: {
    fontSize: 16,
    fontWeight: "600",
  },

  totalRow: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6D4B2F",
  },

  method: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },

  homeBtn: {
    marginTop: 25,
    backgroundColor: "#6D4B2F",
    padding: 15,
    borderRadius: 12,
  },

  homeText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
