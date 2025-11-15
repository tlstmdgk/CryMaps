import MapScreen from "./map";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Zain_400Regular } from "@expo-google-fonts/zain";

const COLORS = {
  primary: "#A0C4E2",
  background: "#F7F9FA",
  border: "#DDE3E8",
  text: "#334E68",
  white: "#FFFFFF",
};

export default function Index() {
  const [fontsLoaded] = useFonts({
    Zain_400Regular,
  });

  const onNavPress = (item: string) => {
    console.log("Pressed:", item);
    // add nav logic laterz
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.safe}>
      <SafeAreaView style={styles.safeContent} edges={["top"]}>
        <Text style={styles.title}>CryMaps</Text>
        <View style={styles.menu}>
          <MapScreen />
        </View>
      </SafeAreaView>

      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => onNavPress("map")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavPress("feed")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavPress("profile")}
          style={styles.navItem}
        >
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  safeContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  title: {
    color: COLORS.primary,
    fontSize: 32,
    fontFamily: "Zain_400Regular",
    paddingVertical: 12,
  },
  menu: {
    flex: 1,
    marginTop: 10,
    borderRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
  navbar: {
    height: 85,
    width: "100%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 15,
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "Zain_400Regular",
  },
});