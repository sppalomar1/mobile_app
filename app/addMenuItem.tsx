import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../supabaseClient";

export default function AddMenuItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please enable gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
 // CORRECT NEW API
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload image → Supabase Storage
  const uploadImage = async (uri: string) => {
    try {
      // Convert image file → base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 → binary
      const binary = Uint8Array.from(atob(base64), (char) =>
        char.charCodeAt(0)
      );

      const fileName = `menu_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("menu-images")
        .upload(fileName, binary, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error(error);
        Alert.alert("Upload failed", error.message);
        return null;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const saveMenuItem = async () => {
    const imageUrl = image ? await uploadImage(image) : null;

    const { error } = await supabase.from("menu_items").insert({
      name,
      price: parseFloat(price),
      image_url: imageUrl,
    });

    if (error) {
      Alert.alert("Error saving menu item", error.message);
      return;
    }

    Alert.alert("Success", "Menu item added!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Menu Item</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Price"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.btn} onPress={saveMenuItem}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  imageBox: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  btn: {
    backgroundColor: "#0066ff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
