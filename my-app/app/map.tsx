import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Image,
  Alert, // <-- Import Button
} from "react-native";
import MapView, { Marker, MapPressEvent, Callout  } from "react-native-maps";
import * as Location from "expo-location";
import { signOut } from "../lib/auth"; // <-- Import your signOut function
import { createClient } from "@supabase/supabase-js";
const supabase = createClient('https://dcaoifzkyecshfpfgjhk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYW9pZnpreWVjc2hmcGZnamhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDEsImV4cCI6MjA3ODc5MTEwMX0.-kpLikBwm0yW1Z-2BKBwboMHeCyBQZ-YzsXo-PgjvOs');


export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  //changing stuff
  //changing stuff
  const [markers, setMarkers] = useState<any[]>([]);
  const [addingMode, setAddingMode] = useState(false);
  const defaultDesc = "I cried here."

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

  useEffect(() => {
    loadMarkers();
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

  async function loadMarkers() {
    const { data, error } = await supabase.from("cry_locs").select("*");

    if (error) {
      console.log(error);
      return;
    }

    setMarkers(data);
  }

  // Add marker to Supabase
  async function addMarkerToDB(lat: number, lng: number, desc: string) {
    const { data, error } = await supabase
      .from("cry_locs")
      .insert([{ latitude: lat, longitude: lng, description: desc }])
      .select();

    if (error) {
      console.log(error);
      alert("Error saving marker.");
      return;
    }

    // Append new marker to state
    setMarkers((prev) => [...prev, data[0]]);
  }

  // Handle map tap
  function handleMapPress(e: MapPressEvent) {
    if (!addingMode) return;

    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    Alert.prompt(
      "Add Cry Spot",
      "Enter a description for this location:",
      [
        {
          text: "Cancel",
          onPress: () => setAddingMode(false),
          style: "cancel"
        },
        {
          text: "Add",
          onPress: (description) => {
            const desc = description?.trim() || defaultDesc;
            addMarkerToDB(latitude, longitude, desc);
            setAddingMode(false);
            alert("Cry spot added!");
          }
        }
      ],
      "plain-text",
      defaultDesc
    );
  }

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
        onPress={handleMapPress}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutHeader}>
                  <Image 
                    source={require('../assets/images/default.png')} 
                    style={styles.profilePic}
                  />
                  <Text style={styles.calloutTitle}>User's Cry Spot</Text>
                </View>
                <Text style={styles.calloutDescription}>{m.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Add cry spot button */}
      <TouchableOpacity
        style={[styles.addButton, addingMode && { backgroundColor: "#34C759" }]}
        onPress={() => setAddingMode((prev) => !prev)}
      >
        <Text style={styles.addButtonText}>{addingMode ? "✔" : "+"}</Text>
      </TouchableOpacity>

      {addingMode && (
        <View style={styles.addingBanner}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Tap anywhere on the map to add a cry spot</Text>
        </View>
      )}

      <View style={styles.signOutButtonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff0000" />
      </View>
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
    top: 600,
    right: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 2,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addingBanner: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
  },
  calloutContainer: {
    width: 200, // Set a fixed width to enable wrapping
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 12,
    flexWrap: 'wrap', // Enable text wrapping
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15, // Makes it circular
    marginRight: 8,
  },
});