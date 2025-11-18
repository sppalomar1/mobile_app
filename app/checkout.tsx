import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabaseClient';

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
    // Update status to "paid"
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('user_id', userId)
      .eq('status', 'pending');

    setShowQR(false);
    router.replace('/receipt');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {orders.map((o) => (
          <View key={o.id} style={styles.row}>
            <Text>{o.menu_items.name}</Text>
            <Text>₱{Number(o.total).toFixed(2)}</Text>
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

      {/* GCash Modal */}
      <Modal visible={showQR} transparent animationType="slide">
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
  container: { padding: 20, flex: 1 },
  header: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: { fontSize: 20, fontWeight: '700' },
  payBtn: {
    backgroundColor: '#0066ff',
    padding: 15,
    borderRadius: 12,
  },
  payText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: '700' },

  // Modal
  modalBG: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 15 },
  qr: { width: 200, height: 200, marginBottom: 20 },

  confirmBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  confirmText: { color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '700' },
  cancelText: { marginTop: 10, color: 'red', fontSize: 16 },
});
