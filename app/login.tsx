import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ADMIN_EMAIL, supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      const userEmail = data?.user?.email;

      if (userEmail === ADMIN_EMAIL) {
        router.replace("/admin/menu");
      } else {
        router.replace("/customer/menu");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Log In</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder=""
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder=""
      />

      {message ? <Text style={styles.error}>{message}</Text> : null}

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.socialRow}>
        <Image source={require("../assets/images/fb.png")} style={styles.socialIcon} />
        <Image source={require("../assets/images/gmail.png")} style={styles.socialIcon} />
        <Image source={require("../assets/images/x.png")} style={styles.socialIcon} />
      </View>

      {/* SIGN UP BUTTON BELOW SOCIAL ICONS */}
      <TouchableOpacity style={styles.signupBtn} onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B37044",
    padding: 25,
    alignItems: "center",
  },
  logo: { width: 160, height: 160, marginTop: 60, marginBottom: 10 },
  title: { fontSize: 28, color: "white", fontWeight: "600", marginBottom: 20, fontStyle: "italic" },
  label: { color: "white", marginTop: 10, alignSelf: "flex-start", marginLeft: 20 },
  input: { width: "90%", backgroundColor: "white", borderRadius: 20, padding: 12, marginVertical: 5 },
  loginBtn: { backgroundColor: "#6D4B2F", paddingVertical: 10, paddingHorizontal: 40, borderRadius: 20, marginTop: 15 },
  loginText: { color: "white", fontWeight: "700" },
  error: { color: "yellow", marginVertical: 5 },
  socialRow: { flexDirection: "row", marginTop: 25, gap: 20 },
  socialIcon: { width: 35, height: 35 },

  // Sign Up Button styles
  signupBtn: {
    marginTop: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signupText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
