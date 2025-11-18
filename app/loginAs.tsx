import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginAs() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />

      <Text style={styles.title}>Log In As</Text>

      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Image source={require("../assets/images/customer.jpg")} style={styles.icon} />
        </View>

        <View style={styles.iconBox}>
          <Image source={require("../assets/images/admin.jpg")} style={styles.icon} />
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnText}>Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    alignItems: "center",
    paddingTop: 80,
  },
  logo: { width: 160, height: 160, marginBottom: 20 },
  title: {
    color: "white",
    fontSize: 28,
    marginBottom: 40,
    fontStyle: "italic",
  },
  row: { flexDirection: "row", gap: 50, marginVertical: 10 },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#D9A47C",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 60, height: 60 },
  btn: {
    backgroundColor: "#6D4B2F",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: { color: "white" },
});
