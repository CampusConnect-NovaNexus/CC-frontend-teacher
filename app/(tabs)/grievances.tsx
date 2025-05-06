import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import GrievanceCard from '@/components/GrievanceCard';
import { fetchGrievances } from '@/service/grievance/fetchGrievances';

type GrievanceStatus = 'all' | 'pending' | 'resolved';

interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  userId: string;
  upvotes: number;
  comments: number;
}

export default function GrievancesScreen() {
  const params = useLocalSearchParams();
  const initialFilter = (params.filter as GrievanceStatus) || 'all';
  
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<GrievanceStatus>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGrievances();
  }, [filter]);

  const loadGrievances = async () => {
    try {
      setLoading(true);
      const data = await fetchGrievances(filter);
      setGrievances(data);
    } catch (error) {
      console.error('Error loading grievances:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadGrievances();
  };

  const handleGrievancePress = (grievance: Grievance) => {
    // Use the correct route pattern that matches the expected types
    router.push({
      pathname: "/grievance/[id]",
      params: { id: grievance.id }
    });
  };

  const filteredGrievances = grievances.filter(grievance => 
    grievance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grievance.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGrievanceItem = ({ item }: { item: Grievance }) => (
    <GrievanceCard 
      grievance={item} 
      onPress={() => handleGrievancePress(item)}
      isAdmin={true}
    />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#95a5a6" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search grievances..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#95a5a6" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View className="flex-row mt-4">
          <TouchableOpacity 
            className={`mr-2 px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`}
            onPress={() => setFilter('all')}
          >
            <Text className={filter === 'all' ? 'text-white' : 'text-gray-700'}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`mr-2 px-4 py-2 rounded-full ${filter === 'pending' ? 'bg-yellow-500' : 'bg-gray-200'}`}
            onPress={() => setFilter('pending')}
          >
            <Text className={filter === 'pending' ? 'text-white' : 'text-gray-700'}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`px-4 py-2 rounded-full ${filter === 'resolved' ? 'bg-green-500' : 'bg-gray-200'}`}
            onPress={() => setFilter('resolved')}
          >
            <Text className={filter === 'resolved' ? 'text-white' : 'text-gray-700'}>Resolved</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={filteredGrievances}
          renderItem={renderGrievanceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Ionicons name="document-text-outline" size={60} color="#bdc3c7" />
              <Text className="text-gray-500 mt-4 text-lg">No grievances found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}