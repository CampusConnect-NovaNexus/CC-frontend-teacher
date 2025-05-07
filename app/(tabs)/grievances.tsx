import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import GrievanceCard, { Grievance } from '@/components/GrievanceCard';
import { fetchGrievances } from '@/service/grievance/fetchGrievances';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { spacing, layout, borderRadius } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

type GrievanceStatus = 'all' | 'pending' | 'resolved';

export default function GrievancesScreen() {
  const params = useLocalSearchParams();
  const initialFilter = (params.filter as GrievanceStatus) || 'all';
  
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<GrievanceStatus>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');
  const textInverseColor = useThemeColor({}, 'textInverse');
  const borderColor = useThemeColor({}, 'border');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const backgroundSecondaryColor = useThemeColor({}, 'backgroundSecondary');

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
  
  // Get filter button style based on current filter
  const getFilterButtonStyle = (buttonFilter: GrievanceStatus) => {
    let backgroundColor;
    
    if (filter === buttonFilter) {
      switch (buttonFilter) {
        case 'all':
          backgroundColor = primaryColor;
          break;
        case 'pending':
          backgroundColor = warningColor;
          break;
        case 'resolved':
          backgroundColor = successColor;
          break;
        default:
          backgroundColor = primaryColor;
      }
      
      return {
        backgroundColor,
        borderColor: backgroundColor,
      };
    }
    
    return {
      backgroundColor: backgroundSecondaryColor,
      borderColor,
    };
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView 
        surface="card" 
        elevation="sm"
        style={styles.searchContainer}
      >
        <Input
          placeholder="Search grievances..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search"
          rightIcon={searchQuery ? "close-circle" : undefined}
          onRightIconPress={searchQuery ? () => setSearchQuery('') : undefined}
          containerStyle={styles.searchInputContainer}
        />
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              getFilterButtonStyle('all')
            ]}
            onPress={() => setFilter('all')}
          >
            <ThemedText 
              variant="labelMedium"
              style={{ 
                color: filter === 'all' ? textInverseColor : textSecondaryColor 
              }}
            >
              All
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              getFilterButtonStyle('pending')
            ]}
            onPress={() => setFilter('pending')}
          >
            <ThemedText 
              variant="labelMedium"
              style={{ 
                color: filter === 'pending' ? textInverseColor : textSecondaryColor 
              }}
            >
              Pending
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              getFilterButtonStyle('resolved')
            ]}
            onPress={() => setFilter('resolved')}
          >
            <ThemedText 
              variant="labelMedium"
              style={{ 
                color: filter === 'resolved' ? textInverseColor : textSecondaryColor 
              }}
            >
              Resolved
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <FlatList
          data={filteredGrievances}
          renderItem={renderGrievanceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="document-text-outline" 
                size={60} 
                color={textSecondaryColor} 
              />
              <ThemedText 
                variant="bodyLarge" 
                style={[styles.emptyText, { color: textSecondaryColor }]}
              >
                No grievances found
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  separator: {
    height: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.md,
  },
});