import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker, MapPressEvent, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { signOut } from "../lib/auth";
import { supabase } from "../lib/supabase"; // <-- IMPORT from lib
import { useFonts, Zain_400Regular } from "@expo-google-fonts/zain";

const COLORS = {
  primary: "#A0C4E2",
  accent: "#80C6C1",
  active: "#334E68",
  background: "#F7F9FA",
  border: "#DDE3E8",
  text: "#334E68",
  white: "#FFFFFF",
  red: "#E53E3E",
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const [addingMode, setAddingMode] = useState(false);
  const defaultDesc = "I cried here.";

  const [fontsLoaded] = useFonts({
    Zain_400Regular,
  });

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

  async function handleSignOut() {
    try {
      await signOut();
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async function loadMarkers() {
    const { data, error } = await supabase.from("cry_locs").select("*");
    if (error) {
      console.log(error);
      return;
    }
    setMarkers(data);
  }

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
    setMarkers((prev) => [...prev, data[0]]);
  }

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
          style: "cancel",
        },
        {
          text: "Add",
          onPress: (description: string | undefined) => {
            const desc = description?.trim() || defaultDesc;
            addMarkerToDB(latitude, longitude, desc);
            setAddingMode(false);
          },
        },
      ],
      "plain-text",
      defaultDesc
    );
  }

  if (loading || !location || !fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.text, marginTop: 10 }}>
          Loading map…
        </Text>
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
            {/* pin */}
            <View style={styles.pin}>
              <View style={styles.pinInner} />
            </View>

            <Callout>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutHeader}>
                  <Image
                    source={require("../assets/images/default.png")}
                    style={styles.profilePic}
                  />
                  <Text style={styles.calloutTitle}>A Cry Spot</Text>
                </View>
                <Text style={styles.calloutDescription}>{m.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* button to add cry spot */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: addingMode ? COLORS.white : COLORS.primary,
          },
        ]}
        onPress={() => setAddingMode((prev) => !prev)}
      >
        <Text style={[
          styles.addButtonText,
          {
            color: addingMode ? COLORS.primary : COLORS.text 
          }
        ]}>
          {addingMode ? "✔" : "+"}
        </Text>
      </TouchableOpacity>

      {addingMode && (
        <View style={styles.addingBanner}>
          <Text style={styles.addingBannerText}>
            Tap anywhere on the map to add a cry spot
          </Text>
        </View>
      )}

      {/* signout button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  addButtonText: {
    // color: COLORS.text,
    fontSize: 32,
    marginTop: -3,
  },
  signOutButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  signOutButtonText: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: "bold",
  },
  addingBanner: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    backgroundColor: COLORS.text,
    padding: 10,
    borderRadius: 8,
  },
  addingBannerText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  calloutContainer: {
    width: 200,
    padding: 5,
    backgroundColor: COLORS.white,
  },
  calloutTitle: {
    fontFamily: "Zain_400Regular",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 5,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 14,
    color: COLORS.text,
    flexWrap: "wrap",
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pin: {
    backgroundColor: "transparent",
    width: 30,
    height: 40,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pinInner: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderBottomRightRadius: 0,
    transform: [{ rotate: "45deg" }],
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});