import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
};

export default function EditMenuItem() {
  const params = useLocalSearchParams<{ item: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (params.item) {
      const parsed: MenuItem = JSON.parse(params.item);
      setItem(parsed);
      setName(parsed.name);
      setPrice(parsed.price.toString());
      setDescription(parsed.description || "");
      setImageUrl(parsed.image_url || "");
    }
  }, [params.item]);

  const handleUpdate = async () => {
    if (!item) return;
    if (!name || !price) {
      Alert.alert("Error", "Name and price are required.");
      return;
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        name,
        price: parseFloat(price),
        description: description || null,
        image_url: imageUrl || null,
      })
      .eq("id", item.id);

    if (error) Alert.alert("Error", error.message);
    else router.replace("/admin/menu");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Food Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter food name" />

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Enter price" keyboardType="numeric" />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />

        <Text style={styles.label}>Image URL (Optional)</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="Enter image URL" />

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateBtnText}>Update Menu Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B37044", padding: 20 },
  card: { backgroundColor: "white", borderRadius: 20, padding: 20 },
  label: { fontWeight: "700", marginTop: 10, color: "#333" },
  input: { backgroundColor: "#f0f0f0", borderRadius: 12, padding: 10, marginTop: 5 },
  updateBtn: { backgroundColor: "#0066ff", paddingVertical: 14, borderRadius: 25, marginTop: 20 },
  updateBtnText: { color: "white", textAlign: "center", fontWeight: "700", fontSize: 18 },
});
