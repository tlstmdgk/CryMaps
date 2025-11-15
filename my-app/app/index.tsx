import MapScreen from "./map";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Zain_400Regular} from '@expo-google-fonts/zain'

export default function Index() {

  const [fontsLoaded] = useFonts({
    Zain_400Regular,
  })

  const onNavPress = (item) => {
    console.log("Pressed:", item);
    // TODO: add navigation logic here
  };

  return (
    <View style={styles.safe}>
      {/* Safe content */}
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.title}>CryMaps</Text>
        <View style={styles.menu}>
          <MapScreen />
        </View>
      </SafeAreaView>

      {/* Bottom nav bar (extends to bottom) */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => onNavPress("map")} style={styles.navItem}>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavPress("feed")} style={styles.navItem}>
          <Text style={styles.navText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavPress("profile")} style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Zain_400Regular',
  },
  menu: {
    flex: 1,
    marginTop: '5%',
    borderRadius: 20,
    padding: 2,
    width: '100%',
  },
  titlecon: {
    marginTop: '5%',
    borderRadius: 10,
    width: '90%',
    maxHeight: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'lightblue',
    borderWidth: 3,
  },
  safe: {
    flex: 1,
    backgroundColor: '#171a37ff',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
  },

  // --- NAV BAR STYLES ---
  navbar: {
    height: 85,
    width: '100%',
    backgroundColor: '#171a37ff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#444',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Zain_400Regular',
  }
});