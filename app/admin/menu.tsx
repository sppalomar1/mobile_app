import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ADMIN_EMAIL, supabase } from "../../supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
};

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email ?? null);

      // Redirect non-admins to customer menu
      if (data?.user?.email && data.user.email !== ADMIN_EMAIL) {
        router.replace("/customer/menu");
      }
    };
    loadUser();
  }, []);

  const deleteMenuItem = async (id: number) => {
    Alert.alert("Delete Menu Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("menu_items").delete().eq("id", id);
          if (!error) fetchMenu();
        },
      },
    ]);
  };

  const editMenuItem = (item: MenuItem) => {
    router.push({ pathname: "/admin/editMenuItem", params: { item: JSON.stringify(item) } });
  };

  // --- Logout function ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Logout Button --- */}
      {userEmail === ADMIN_EMAIL && (
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      )}

      {userEmail === ADMIN_EMAIL && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/admin/addMenuItem")}
        >
          <Text style={styles.addBtnText}>Add Menu Item</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* --- Card opens Edit page now --- */}
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1 }}
              onPress={() => editMenuItem(item)} // <-- changed here
            >
              {item.image_url && <Image source={{ uri: item.image_url }} style={styles.img} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>₱ {item.price.toFixed(2)}</Text>
                {item.description && <Text style={styles.description}>{item.description}</Text>}
              </View>
            </TouchableOpacity>

            {userEmail === ADMIN_EMAIL && (
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => editMenuItem(item)}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteMenuItem(item.id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#C48A5A", // lighter brown background
  },
  card: {
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  img: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
  name: { fontWeight: "700", fontSize: 16 },
  description: { color: "#555", marginTop: 4 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  editBtn: {
    backgroundColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "brown",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: { color: "white", fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#6D4B2F",
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  addBtnText: { color: "white", textAlign: "center", fontWeight: "700" },
  logoutBtn: {
    backgroundColor: "#B37044",
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});
