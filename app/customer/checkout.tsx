import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../supabaseClient';

export default function Checkout() {
  const [userId, setUserId] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUserId(data.user.id);
      loadOrders(data.user.id);
    }
  };

  const loadOrders = async (uid: string) => {
    const { data } = await supabase
      .from('orders')
      .select('id, quantity, total, menu_items(name)')
      .eq('user_id', uid)
      .eq('status', 'pending');

    if (data) {
      setOrders(data);
      const sum = data.reduce((t, o) => t + Number(o.total), 0);
      setTotalAmount(sum);
    }
  };

  const confirmPayment = async () => {
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('user_id', userId)
      .eq('status', 'pending');

    setShowQR(false);
    router.replace('/customer/receipt');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {orders.map((o) => (
          <View key={o.id} style={styles.row}>
            <Text style={styles.itemName}>{o.menu_items.name}</Text>
            <Text style={styles.itemPrice}>₱{Number(o.total).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>TOTAL</Text>
          <Text style={styles.totalText}>₱{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={() => setShowQR(true)}>
        <Text style={styles.payText}>PAY WITH GCASH</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={showQR} animationType="fade">
        <View style={styles.modalBG}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Scan to Pay</Text>

            <Image
              source={{ uri: 'https://i.ibb.co/2d1F4tN/gcash-qr-sample.png' }}
              style={styles.qr}
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmPayment}>
              <Text style={styles.confirmText}>I HAVE PAID</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowQR(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#6D4B2F",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  itemName: {
    fontSize: 16,
    color: "#444",
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6D4B2F",
  },

  totalRow: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6D4B2F",
  },

  payBtn: {
    backgroundColor: "#6D4B2F",
    padding: 15,
    borderRadius: 14,
  },

  payText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  // MODAL
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    backgroundColor: "white",
    width: "85%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#6D4B2F",
  },

  qr: {
    width: 220,
    height: 220,
    marginBottom: 25,
  },

  confirmBtn: {
    backgroundColor: "#B37044",
    padding: 12,
    borderRadius: 12,
    width: "100%",
  },

  confirmText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  cancelText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6D4B2F",
    fontWeight: "700",
  },
});
