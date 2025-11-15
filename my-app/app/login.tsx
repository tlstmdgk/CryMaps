import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { loginAnonymously, signInWithEmail, signUpWithEmail } from "../lib/auth";
import { useFonts, Zain_400Regular } from "@expo-google-fonts/zain";

const COLORS = {
  primary: "#A0C4E2",
  background: "#F7F9FA",
  border: "#DDE3E8",
  text: "#334E68",
  white: "#FFFFFF",
  red: "#E53E3E",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Zain_400Regular,
  });

  async function handleSignup() {
    setLoading(true);
    setError("");
    try {
      await signUpWithEmail(email, pw);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      await signInWithEmail(email, pw);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleAnon() {
    setLoading(true);
    setError("");
    try {
      await loginAnonymously();
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>CryMaps</Text>
      <Text style={styles.subtitle}>Find and share your cry spots</Text>

      <TextInput
        placeholder="email@address.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="password"
        value={pw}
        onChangeText={setPw}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonTextPrimary}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonTextSecondary}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonAnonymous}
        onPress={handleAnon}
        disabled={loading}
      >
        <Text style={styles.buttonTextAnonymous}>Continue Anonymously</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: "Zain_400Regular",
    fontSize: 64,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.red,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonTextPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonAnonymous: {
    marginTop: 10,
  },
  buttonTextAnonymous: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: "center",
  },
});