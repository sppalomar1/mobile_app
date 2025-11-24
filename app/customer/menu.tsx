import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
};

export default function CustomerMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // --- Load logged-in user email ---
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email ?? null);
    };
    loadUser();
  }, []);

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error fetching menu:", error.message);
    } else {
      setItems(data as MenuItem[]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

  const openOrder = (id: number) => {
    router.push({ pathname: "/customer/order", params: { id: id.toString() } });
  };

  // --- Logout function ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout failed:", error.message);
    else router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openOrder(item.id)}>
            <Image
              source={{ uri: item.image_url || "https://via.placeholder.com/120?text=No+Image" }}
              style={styles.img}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>₱ {item.price.toFixed(2)}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B37044", padding: 16 },

  // --- Logout button styles ---
  logoutBtn: {
    backgroundColor: "#6D4B2F",
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  img: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  description: { fontSize: 14, color: "#555", marginTop: 2 },
});
