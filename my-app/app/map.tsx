import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button, // <-- Import Button
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { signOut } from "../lib/auth"; // <-- Import your signOut function

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Get user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
      setLoading(false);
    })();
  }, []);

  // --- Sign Out Function ---
  async function handleSignOut() {
    try {
      await signOut();
      // The AuthContext will automatically redirect to /login
    } catch (e: any) {
      console.error(e.message);
    }
  }
  // -------------------------

  if (loading || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading map…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Example marker — you’ll replace these with Supabase data later */}
        <Marker
          coordinate={{
            latitude: location.latitude + 0.0005,
            longitude: location.longitude + 0.0005,
          }}
          title="Example Cry Spot"
          description="This is where someone cried."
        />
      </MapView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => alert("Add cry spot screen coming soon!")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* --- Sign Out Button --- */}
      <View style={styles.signOutButtonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff0000" />
      </View>
      {/* --------------------- */}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: "white",
    fontSize: 32,
    marginTop: -3,
  },
  // --- New style for the sign out button ---
  signOutButtonContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 2,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});