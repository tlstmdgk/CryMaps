import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useFonts, Zain_400Regular } from "@expo-google-fonts/zain";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    };
    getUser();
  }, []);

  // load the user's current avatar
  const fetchProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("profile_picture_url, name")
      .eq("id", id)
      .single();

    if (!error && data) {
      if (data.profile_picture_url) {
        setAvatarUrl(data.profile_picture_url);
      }
      if (data.name) {
        setUserName(data.name);
      }
    }
  };

  // pick n upload image
  const uploadAvatar = async () => {
    try {
      setUploading(true);

      if (!user) {
        alert("User not logged in");
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      
      // generate unique filename w/ timestamp
      const fileExt = file.uri.split(".").pop()?.toLowerCase() ?? "jpg";
      const timestamp = Date.now();
      const fileName = `${user.id}_${timestamp}.${fileExt}`;

      console.log("Reading file:", file.uri);

      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Base64 length:", base64.length);

      const arrayBuffer = decode(base64);

      console.log("ArrayBuffer size:", arrayBuffer.byteLength);

      const contentType = fileExt === "png" ? "image/png" : "image/jpeg";

      console.log("Uploading to Supabase...");

      // upload to supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, arrayBuffer, {
          contentType,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", uploadData);

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      console.log("Public URL:", publicUrl);

      const { error: dbError } = await supabase
        .from("users")
        .update({ profile_picture_url: publicUrl })
        .eq("id", user.id);

      if (dbError) {
        console.error("DB error:", dbError);
        throw dbError;
      }

      setAvatarUrl(publicUrl);
      alert("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      alert(`Error: ${error.message || JSON.stringify(error)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <TouchableOpacity onPress={uploadAvatar} disabled={uploading}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text>No Avatar</Text>
          </View>
        )}
      </TouchableOpacity>

      {userName && (
        <Text style={styles.userName}>{userName}</Text>
      )}

      <Text style={{ marginTop: 10, color: "#666" }}>
        Tap the avatar to upload a new one
      </Text>

      {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 15,
    color: "#333",
  },
});
