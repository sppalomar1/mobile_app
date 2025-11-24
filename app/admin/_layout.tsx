import { Stack } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function AdminLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#B37044" }}>
      
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Admin Panel</Text>

        <Image
          source={require("../../assets/images/admin.png")}
          style={styles.icon}
        />
      </View>

      {/* Page content */}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 110,
    backgroundColor: "#B37044",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "700",
  },
  icon: {
    width: 45,
    height: 45,
  },
});
