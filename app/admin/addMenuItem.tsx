import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../supabaseClient";

export default function AddMenuItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    try {
      setUploading(true);

      const imageName = `menu_${Date.now()}.jpg`;
      const arrayBuffer = await fetch(image).then(res => res.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(imageName, arrayBuffer, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(imageName);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !price) {
      Alert.alert("Error", "Name and price are required.");
      return;
    }

    if (!image) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    const uploadedUrl = await uploadImage();
    if (!uploadedUrl) return;

    const { error } = await supabase.from("menu_items").insert([
      {
        name,
        price: parseFloat(price),
        description: description || null,
        image_url: uploadedUrl,
      },
    ]);

    if (error) Alert.alert("Error", error.message);
    else router.replace("/admin/menu");
  };

  const handleCancel = () => {
    router.replace("/admin/menu");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Food Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter food name"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <Text style={styles.label}>Image</Text>

        {/* Image Preview */}
        {image && <Image source={{ uri: image }} style={styles.preview} />}

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>
            {image ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={uploading}>
          <Text style={styles.addBtnText}>
            {uploading ? "Uploading..." : "Add Menu Item"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
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
  preview: { width: "100%", height: 200, borderRadius: 12, marginTop: 10 },
  imageBtn: { backgroundColor: "#B37044", paddingVertical: 14, borderRadius: 25, marginTop: 10 },
  imageBtnText: { color: "white", textAlign: "center", fontWeight: "700", fontSize: 16 },
  addBtn: { backgroundColor: "#6D4B2F", paddingVertical: 14, borderRadius: 25, marginTop: 20 },
  addBtnText: { color: "white", textAlign: "center", fontWeight: "700", fontSize: 18 },
  cancelBtn: { backgroundColor: "#8B5A2B", paddingVertical: 14, borderRadius: 25, marginTop: 10 },
  cancelBtnText: { color: "white", textAlign: "center", fontWeight: "700", fontSize: 18 },
});
