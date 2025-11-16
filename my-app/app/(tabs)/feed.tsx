import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { useFonts, Zain_400Regular } from "@expo-google-fonts/zain";
import { supabase } from "../../lib/supabase";

// Add type definition
interface Post {
  id: string;
  created_at: string;
  latitude: number;
  longitude: number;
  description: string;
  user_id: string;
  userName: string;
  profilePictureUrl: string;
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]); // Add type here
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fontsLoaded] = useFonts({ Zain_400Regular });

  const fetchPosts = async () => {
  try {
    // Fetch cry_locs
    const { data: cryLocs, error: cryError } = await supabase
      .from('cry_locs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (cryError) throw cryError;

    // Filter out posts with invalid user_ids and get unique user IDs
    const validCryLocs = cryLocs.filter(post => post.user_id && post.user_id !== 'null');
    const userIds = [...new Set(validCryLocs.map(post => post.user_id))];

    // Only fetch users if we have valid IDs
    if (userIds.length === 0) {
      setPosts([]);
      return;
    }

    // Fetch users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (userError) throw userError;

    // Create a map of users by ID
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as any);

    // Combine posts with user data and profile pictures
    const postsWithUserData = validCryLocs.map((post) => {
      const user = userMap[post.user_id];
      
      // Use profile_picture_url from users table to get the image from storage
      let profilePictureUrl = '';
      if (user?.profile_picture_url) {
        profilePictureUrl = user.profile_picture_url;
      }

      return {
        ...post,
        userName: user?.name || 'Anonymous',
        profilePictureUrl: profilePictureUrl || 'https://via.placeholder.com/48'
      };
    });

    setPosts(postsWithUserData);
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image
          source={{ uri: item.profilePictureUrl }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Zain_400Regular',
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Zain_400Regular',
    color: '#333',
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Zain_400Regular',
  },
});