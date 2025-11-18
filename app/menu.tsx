import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ADMIN_EMAIL, supabase } from '../supabaseClient';

export default function Menu() {
  const [items, setItems] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // -----------------------------
  // FETCH MENU FROM SUPABASE
  // -----------------------------
  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching menu:', error.message);
    } else {
      setItems(data || []);
    }
  };

  // -----------------------------
  // RUN ON SCREEN FOCUS (AUTO REFRESH)
  // -----------------------------
  useFocusEffect(
    useCallback(() => {
      fetchMenu();
      return () => {};
    }, [])
  );

  // -----------------------------
  // GET USER EMAIL (ONE TIME)
  // -----------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email ?? null);
    };
    loadUser();
  }, []);

  const openOrder = (id: string) => {
    router.push({ pathname: '/order', params: { id } });
  };

  // -----------------------------
  // DELETE MENU ITEM (ADMIN)
  // -----------------------------
  const deleteMenuItem = async (id: number) => {
    Alert.alert(
      "Delete Menu Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("menu_items")
              .delete()
              .eq("id", id);

            if (!error) fetchMenu();
          }
        }
      ]
    );
  };

  const editMenuItem = (item: any) => {
    router.push({
      pathname: "/editMenuItem",
      params: { item: JSON.stringify(item) }
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {userEmail === ADMIN_EMAIL && (
        <Button
          title="Add Menu Item (Admin)"
          onPress={() => router.push('/addMenuItem')}
        />
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <TouchableOpacity
              style={{ flexDirection: 'row', flex: 1 }}
              onPress={() => openOrder(item.id)}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.img} />
              ) : null}

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>₱ {Number(item.price).toFixed(2)}</Text>
              </View>
            </TouchableOpacity>

            {/* ADMIN ONLY */}
            {userEmail === ADMIN_EMAIL && (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => editMenuItem(item)}
                >
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteMenuItem(item.id)}
                >
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
  
  {userEmail !== ADMIN_EMAIL && (
    <Button title="My Orders" onPress={() => router.push('/orders')} />
  )}

  {userEmail === ADMIN_EMAIL && (
    <Button title="All Orders (Admin)" onPress={() => router.push('/adminOrders')} />
  )}

  <Button
    title="Logout"
    color="red"
    onPress={() => supabase.auth.signOut().then(() => router.replace('/login'))}
  />
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2
  },
  img: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
  name: { fontWeight: '700', fontSize: 16 },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },
  editBtn: {
    backgroundColor: '#0066ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  deleteBtn: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
