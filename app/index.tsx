import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ADMIN_EMAIL, supabase } from "../supabaseClient";

export default function Index() {
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setTimeout(async () => {
        if (session) {
          // Fetch user info to determine role
          const { data: userData } = await supabase.auth.getUser();
          const email = userData?.user?.email;

          if (email === ADMIN_EMAIL) router.replace("/admin/menu");
          else router.replace("/customer/menu");
        } else {
          router.replace("/login");
        }
      }, 2000); // Splash delay
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")} // replace with your logo
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
