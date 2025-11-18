import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { supabase } from "../supabaseClient";

export default function Index() {
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setTimeout(() => {
        if (session) router.replace("/menu");
        else router.replace("/login");
      }, 2000); // Splash delay
    };
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.jpg")} // ← replace with your logo
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
});
