import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
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

export default function EditMenuItem() {
  const { item } = useLocalSearchParams(); // received from menu.tsx
  const parsedItem = JSON.parse(item as string);

  const [name, setName] = useState(parsedItem.name);
  const [price, setPrice] = useState(String(parsedItem.price));
  const [image, setImage] = useState<string | null>(parsedItem.image_url);
  const [replacedImage, setReplacedImage] = useState(false); // tracks new image upload

  // ----------------------------------------------------
  // PICK IMAGE
  // ----------------------------------------------------
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please enable gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setReplacedImage(true);
    }
  };

  // ----------------------------------------------------
  // UPLOAD IMAGE TO SUPABASE
  // ----------------------------------------------------
  const uploadImage = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

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
        console.log(error);
        Alert.alert("Image Upload Failed", error.message);
        return null;
      }

      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  // ----------------------------------------------------
  // SAVE CHANGES
  // ----------------------------------------------------
  const saveChanges = async () => {
    let newImageUrl = parsedItem.image_url;

    // If user selected a new image → upload it
    if (replacedImage && image) {
      newImageUrl = await uploadImage(image);
    }

    const { error } = await supabase
      .from("menu_items")
      .update({
        name,
        price: parseFloat(price),
        image_url: newImageUrl,
      })
      .eq("id", parsedItem.id);

    if (error) {
      Alert.alert("Update Failed", error.message);
      return;
    }

    Alert.alert("Success", "Menu item updated!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Menu Item</Text>

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
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.btn} onPress={saveChanges}>
        <Text style={styles.btnText}>Save Changes</Text>
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
