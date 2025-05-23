
"use client";
import { useAuth } from "@/context/AuthContext";
import { EXPO_AUTH_API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

import TimeAgo from "@/components/TimeAgo";
import { icons } from "@/constants/icons";
import { addResolver } from "@/service/grievance/addResolver";
import { fetchGrievances } from "@/service/grievance/fetchGrievances";
import { getComment } from "@/service/grievance/getComment";
import { getStats } from "@/service/grievance/getStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
interface Comment {
  c_id: string;
  c_message: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

interface Grievance {
  c_id: string;
  user_id: string;
  comment_count: string;
  created_at: string;
  description: string;
  title: string;
  upvotes: string[];
  resolver: string[];
  category: string
}

export default function GrievanceScreen() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    selectedCategory: ""
  });
  const [grievanceItem, setGrievanceItem] = useState<Grievance | null>(null);
  const [grievanceVisible, setGrievanceVisible] = useState(false);
  const [stats, setStats] = useState({
    total_complaints: 0,
    unresolved_complaints: 0,
    resolved_complaints: 0,
  });
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [user_id, setUserId] = useState("");
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const { logout, user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [viewSelectedCategory, setViewSelectedCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);//show category while filling the form 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);//for filter
  const options = ["Infrastructure",
    "Academic",
    "Mess",
    "Hostel",
    "Wifi",
    "Library",
    "Administration",
    "Sports",
    "Others",];

  
  const handleOptionSelect = (option: string) => {
    if (viewSelectedCategory === option) {
      setViewSelectedCategory('');
    } else {
      setViewSelectedCategory(option);
    }
    setDropdownVisible(false);
  };
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("@user_id");
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.error("Error fetching user id:", error);
      }
    };

    getUserId();
  }, []);

  const resolveIssue = async (c_id: string) => {
    
    const res=await addResolver(c_id, user_id);
    
  }
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      loadGrievances();
      loadStats()
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesMap: Record<string, string> = {};

      for (const grievance of grievances) {
        if (!userNamesMap[grievance.user_id]) {
          try {
            const response = await fetch(
              `${EXPO_AUTH_API_URL}/api/v1/auth/user/${grievance.user_id}`
            );
            const userData = await response.json();
            if (userData && userData.name) {
              userNamesMap[grievance.user_id] = userData.name;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }

      setUserNames(userNamesMap);
    };

    if (grievances?.length > 0) {
      fetchUserNames();
    }
  }, [grievances]);

  const clearOldCommentCaches = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const commentKeys = keys.filter((key) => key.startsWith("comments_"));

      const now = Date.now();
      const twoHours = 2 * 60 * 60 * 1000;

      const commentItems = await AsyncStorage.multiGet(commentKeys);

      const keysToRemove: string[] = [];

      for (const [key, value] of commentItems) {
        if (value) {
          const parsed = JSON.parse(value);
          if (!parsed.timestamp || now - parsed.timestamp > twoHours) {
            keysToRemove.push(key);
          }
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
    }
  };
  const loadGrievances = async () => {
    const cacheKey = "cached_grievances";
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && now - parsed.timestamp < twoHours) {
          setGrievances(parsed.data);
        } else {
          await AsyncStorage.removeItem(cacheKey);
        }
      }

      const result = await fetchGrievances();

      if (result) {
        const reversed = result.complaints?.reverse();
        setGrievances(reversed);
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: now, data: reversed })
        );
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Network Error !",
        text2: "Can not fetch grievances at the moment",
      });
    }
    setRefreshing(false);
  };

  const loadStats = async () => {
    const result = await getStats();
    if (result) {
      setStats(result);
    } else {
      Toast.show({
        type: "error",
        text1: "Stats not refreshed",
        text2: "Stats, could not be loaded ",
      });
    }
  };

  useEffect(() => {
    if (grievanceItem) {
      loadComments();
    }
  }, [grievanceItem]);
  useFocusEffect(
    useCallback(() => {
      loadGrievances();
      loadStats();
      clearOldCommentCaches();
    }, [])
  );

  const loadComments = async () => {
    if (!grievanceItem) return;

    const cacheKey = `comments_${grievanceItem.c_id}`;

    try {
      // Try fetching from API
      const result = await getComment(grievanceItem.c_id);
      const fetchedComments = result?.comments.reverse() || null;

      setComments(fetchedComments);

      if (fetchedComments) {
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: fetchedComments })
        );
      }
    } catch (err) {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (parsed.timestamp && now - parsed.timestamp < oneHour) {
          setComments(parsed.data);
        } else {
          await AsyncStorage.removeItem(cacheKey);
          setComments([]);
        }
      } else {
        setComments([]);
      }
    }
  };

  const renderGrievanceItem = ({ item }: { item: Grievance }) => {
    const userName = userNames[item.user_id] || "User";
    return (
      <TouchableOpacity
        className=""
        onPress={async () => {
          await setGrievanceItem(item);
          setGrievanceVisible(true);
        }}
      >
        <View className="line bg-gray-300 w-full h-[1.5px] my-2 shadow-sm shadow-gray-400"></View>
        <View className="px-4 pb-4">
          <View className="flex-row justify-left items-center gap-3">
            <View className="flex-row justify-left items-center gap-3">
              <View className="bg-gray-400 w-11 h-11 rounded-full my-2 justify-center items-center">
                <Image
                  source={icons.profile}
                  className="size-12 rounded-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text className="text-lg font-bold">{userName}</Text>
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-gray-400"></View>
              <TimeAgo
                date={item.created_at}
                className="text-sm text-gray-400 font-bold"
              />
            </View>
          </View>
          <Text className="text-lg font-semibold mb-2">{item.title}</Text>
          <Text className="text-gray-600 mb-3">{item.description}</Text>
          {item.category && (
            <View style={{
              backgroundColor: '#E5E7EB', 
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#9CA3AF', 
            }}>
              <Text style={{
                color: '#374151', 
                fontWeight: '500',
                fontSize: 12,
              }}>{item.category}</Text>
            </View>
          )}
          <View className="flex-row justify-left items-center">
            
            <View className="flex-row justify-center items-center px-2">
              <Pressable
                className="flex-row gap-2 items-center border border-gray-400 bg-gray-100 p-2 px-4 rounded-full ml-1 mt-1"
                style={{ elevation: 1 }}
                onPressIn={() => {
                  setGrievanceItem(item);
                  setGrievanceVisible(true);
                }}
              >
                <Image source={icons.comment} className="size-5" />
                <Text className="text-md text-gray-700 font-bold px-1">
                  {item.comment_count}
                </Text>
              </Pressable>
            </View>
            <Pressable 
              className="flex-row gap-2 border border-gray-500 bg-gray-200 rounded-full px-3 py-1 items-center"
              style={{ elevation: 1 }}
              onPress={() => {
                resolveIssue(item.c_id);
              }}
            >
              <Ionicons name="checkmark" size={24} color="#374151" />
              <Text className="text-gray-700 font-medium">Resolved</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 relative bg-neutral-800">
      <StatusBar style="dark" backgroundColor="#fff" />
      <View className="flex-1 relative bg-white">
        <View className="flex-row justify-between mb-5 p-4">
          <View className="bg-neutral-700 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.total_complaints}
            </Text>
            <Text className="text-white">Total</Text>
          </View>
          <View className="bg-neutral-800 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.unresolved_complaints}
            </Text>
            <Text className="text-white">Pending</Text>
          </View>
          <View className="bg-neutral-900 rounded-lg p-5 flex-1 m-1 items-center">
            <Text className="text-2xl font-bold text-white">
              {stats.resolved_complaints}
            </Text>
            <Text className="text-white">Resolved</Text>
          </View>
        </View>
        <View className="z-10">
          <View className="flex-row justify-between items-center px-4 pb-2">
            <Text
              className="text-3xl font-bold text-gray-800 pb-4"
            >
              Recent Issues
            </Text>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(prev => !prev)}
              style={{
                backgroundColor: 'black', 
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="filter" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          {viewSelectedCategory ? (
            <View style={{
              backgroundColor: '#E5E7EB', 
              marginHorizontal: 16,
              marginBottom: 12,
              padding: 10,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{ color: '#374151', fontWeight: '500' }}>
                Viewing: {viewSelectedCategory}
              </Text>
              <TouchableOpacity onPress={() => setViewSelectedCategory('')}>
                <Ionicons name="close-circle" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          ) : null}
          {/* Filter Modal */}
          <Modal
            isVisible={isDropdownVisible}
            onBackdropPress={() => setIsDropdownVisible(false)}
            animationIn="fadeInDown"
            animationOut="slideOutUp"
            animationInTiming={400}
            animationOutTiming={400}
            backdropTransitionInTiming={400}
            backdropTransitionOutTiming={400}
            backdropColor="rgba(0,0,0,0.5)"
            style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'flex-end' }}
          >
            <View
              style={{
                position: 'absolute',
                top: 100,
                right: 16,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 8,
                width: 180,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleOptionSelect(option);
                    setIsDropdownVisible(false);
                  }}
                  style={{
                    padding: 12,
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                    borderBottomColor: '#F3F4F6',
                    backgroundColor: viewSelectedCategory === option ? '#E5E7EB' : 'transparent',
                    borderRadius: 6,
                  }}
                >
                  <Text style={{
                    color: viewSelectedCategory === option ? '#111827' : '#4B5563',
                    fontWeight: viewSelectedCategory === option ? '600' : 'normal'
                  }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
        </View>

        {grievances?.length === 0 ? (
          <View className="h-40 w-full justify-center">
            <ActivityIndicator size="large" color="#4B5563" />
          </View>
        ) : (
          <FlatList
            data={viewSelectedCategory ? grievances.filter((grievance) => grievance.category === viewSelectedCategory) : grievances}
            renderItem={renderGrievanceItem}
            keyExtractor={(item) => item.c_id}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="-mt-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

       

        <Modal
          isVisible={grievanceVisible}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={400}
          animationOutTiming={400}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={200}
          backdropColor="rgba(0,0,0,0.5)"
          onBackdropPress={() => {
            setGrievanceItem(null);
            setComments(null)
            setGrievanceVisible(false);
          }}
          style={styles.detail_modal}
        >
          <View className="bg-gray-100 rounded-2xl p-5 m-4 border border-gray-300">
            <View className="relative">
              <Pressable
                onPress={() => {
                  setGrievanceVisible(false);
                  setGrievanceItem(null);
                }}
                className="absolute -right-8 -top-8 bg-gray-200 p-3 rounded-full"
                style={{ elevation: 7 }}
              >
                <Image
                  source={icons.cross}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <Text className="text-gray-900 font-bold text-xl mb-2">
              {grievanceItem?.title}
            </Text>
            <Text className="text-gray-700 mb-4">
              {grievanceItem?.description}
            </Text>
            <Text className="text-gray-500 mb-6">
              Posted{" "}
              {grievanceItem ? <TimeAgo date={grievanceItem.created_at} /> : ""}
            </Text>

            <Text className="text-gray-800 font-bold text-lg mb-3">Comments</Text>
            <FlatList
              data={comments || []}
              keyExtractor={(item) => item.comment_id}
              renderItem={({ item }) => {
                return (
                  <View className="bg-gray-200 rounded-lg p-3 mb-2 border border-gray-300">
                    <Text className="text-gray-800">{item.c_message}</Text>
                    <TimeAgo
                      date={item.created_at}
                      className="text-gray-500 text-xs mt-1"
                    />
                  </View>
                );
              }}
              className="mb-4 max-h-40"
            />
            <View className="flex-row items-center gap-2 mt-2">
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  detail_modal: {
    justifyContent: "center",
    margin: 0,
  },
});
