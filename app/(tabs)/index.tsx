import DashboardCard from "@/components/DashboardCard";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { borderRadius, layout, spacing } from "@/constants/Spacing";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getStats } from "@/service/grievance/getStats";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { images } from "@/constants/images";
import { Ionicons } from '@expo/vector-icons';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { FontAwesome, Feather } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pendingGrievances: 0,
    resolvedGrievances: 0,
    totalGrievances: 0,
  });
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      console.log("Refreshing data...");

      loadStats();
      setRefreshing(false);
    }, 2000);
  };
  // Get theme colors
  const primaryColor = useThemeColor({}, "primary");
  const loadStats = async () => {
    console.log("Loading stats...");

    const res = await getStats();
    console.log("res : ", res);

    setStats({
      pendingGrievances: res?.unresolved_complaints || 0,
      resolvedGrievances: res?.resolved_complaints || 0,
      totalGrievances: res?.total_complaints || 0,
    });
  };
  useEffect(() => {
    const loadStats = async () => {
      try {
        loadStats();
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </ThemedView>
    );
  }

  return (
    <View className="flex-1 bg-white mt-12">
      <ScrollView
        className="px-4 pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row justify-around items-center">
          <Text className="text-3xl font-bold text-gray-800 mb-4 mt-4 w-1/2">
            Teacher Dashboard
          </Text>
          <Image
            source={images.nit_logo}
            className="w-36 h-36 mt-4 mb-4"
          />
        </View>

        {/* Quick Actions */}
        <View className="mt-6">
          <Text className="text-gray-600 font-bold text-2xl">Quick Actions</Text>
          <View className="px-2">
            <View className="flex-row justify-around mb-4 mt-8">
              <TouchableOpacity
                onPress={() => router.push("/attendance/take")}
                style={{ elevation: 5 }}
                className="bg-black px-5 py-4 w-40 h-40 rounded-xl items-center justify-center"
              >
                <FontAwesome name="check-square-o" size={28} color="white" />
                <Text className="text-white text-xs text-center font-semibold mt-2 self-auto">Take Attendance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/grievances")}
                style={{ elevation: 5 }}
                className="bg-black px-5 py-4 w-40 h-40 rounded-xl items-center justify-center"
              >
                <Feather name="alert-circle" size={28} color="white" />
                <Text className="text-white text-xs text-center font-semibold mt-2">View Grievances</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around my-4">
              <TouchableOpacity
                onPress={() => router.push("/attendance/reports")}
                style={{ elevation: 5 }}
                className="bg-black px-5 py-4 w-40 h-40 rounded-xl items-center justify-center"
              >
                <Feather name="bar-chart-2" size={28} color="white" />
                <Text className="text-white text-xs text-center font-semibold mt-2">Attendance Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/profile")}
                style={{ elevation: 5 }}
                className="bg-black px-5 py-4 w-40 h-40 rounded-xl items-center justify-center"
              >
                <Feather name="settings" size={28} color="white" />
                <Text className="text-white text-xs text-center font-semibold mt-2">Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Grievance Stats */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 " >
            Grievance Overview
          </Text>

          <View className="flex-row justify-between mb-5 p-4">
            <View className="bg-neutral-700 rounded-lg p-5 flex-1 m-1 items-center">
              <Text className="text-2xl font-bold text-white">
                {stats.totalGrievances}
              </Text>
              <Text className="text-white">Total</Text>
            </View>
            <View className="bg-neutral-800 rounded-lg p-5 flex-1 m-1 items-center">
              <Text className="text-2xl font-bold text-white">
                {stats.pendingGrievances}
              </Text>
              <Text className="text-white">Pending</Text>
            </View>
            <View className="bg-neutral-900 rounded-lg p-5 flex-1 m-1 items-center">
              <Text className="text-2xl font-bold text-white">
                {stats.resolvedGrievances}
              </Text>
              <Text className="text-white">Resolved</Text>
            </View>
          </View>
        </View>

        {/* Attendance Stats */}

        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Attendance Overview
          </Text>
          <View className="flex-row flex-wrap justify-around">
            <TouchableOpacity
              onPress={() => router.push("/attendance/reports")}
              className="bg-cyan-900 rounded-lg m-2 h-40 w-40 p-4 justify-between"
            >
              <View className="flex-row justify-between">
                <Ionicons name="stats-chart" size={28} color="white" />
                <Text className="text-white text-4xl font-bold self-end">
                  69
                </Text>
                <Text className="text-white text-xl font-semibold self-end">
                  %
                </Text>
              </View>
              <View>
                <Text className="text-white text-md font-semibold">
                  Avg.
                </Text>
                <Text className="text-white text-md font-semibold">
                  Attendance
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/attendance/low")}
              className="bg-red-900 rounded-lg m-2 h-40 w-40 p-4 justify-between"
            >
              <View className="flex-row justify-between">
                <Ionicons name="alert-circle" size={28} color="white" />
                <Text className="text-white text-4xl font-bold">
                  10
                </Text>
              </View>
              <View>
                <Text className="text-white text-md font-semibold">
                  Low
                </Text>
                <Text className="text-white text-md font-semibold">
                  Attendance
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/attendance/students")}
              className="bg-rose-900 rounded-lg m-2 h-40 w-40 p-4 justify-between"
            >
              <View className="flex-row justify-between">
                <Ionicons name="people" size={28} color="white" />
                <Text className="text-white text-4xl font-bold">
                  59
                </Text>
              </View>
              <View>
                <Text className="text-white text-md font-semibold">
                  Total
                </Text>
                <Text className="text-white text-md font-semibold">
                  Students
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/attendance/students")}
              className="bg-sky-800 rounded-lg m-2 h-40 w-40 p-4 justify-between"
            >
              <View className="flex-row justify-between">
                <Ionicons name="settings" size={28} color="white" />
              </View>
              <View>
                <Text className="text-white text-md font-semibold">
                  Settings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  pageTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionCard: {
    marginBottom: layout.sectionSpacing,
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.sm,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  actionButton: {
    width: "48%",
    borderRadius: borderRadius.md,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
// return (
//   <ThemedView style={styles.container}>
//     <ScrollView
//       contentContainerStyle={styles.scrollContent}
//       showsVerticalScrollIndicator={false}
//       refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//     >
//       <Text
//       className='text-3xl font-bold text-gray-500'>
//         Teacher Dashboard
//       </Text>

//       {/* Quick Actions */}
//       <Card style={styles.sectionCard}>
//         <CardHeader title="Quick Actions" />
//         <CardContent style={styles.quickActionsContainer}>
//           <View style={styles.actionButtonsRow}>
//             <Button
//               variant="primary"
//               leftIcon="calendar-outline"
//               style={styles.actionButton}
//               onPress={() => router.push('/attendance/take')}
//             >
//               Take Attendance
//             </Button>

//             <Button
//               variant="primary"
//               leftIcon="document-text-outline"
//               style={styles.actionButton}
//               onPress={() => router.push('/grievances')}
//             >
//               View Grievances
//             </Button>
//           </View>

//           <View style={styles.actionButtonsRow}>
//             <Button
//               variant="primary"
//               leftIcon="bar-chart-outline"
//               style={styles.actionButton}
//               onPress={() => router.push('/attendance/reports')}
//             >
//               Attendance Reports
//             </Button>

//             <Button
//               variant="primary"
//               leftIcon="settings-outline"
//               style={styles.actionButton}
//               onPress={() => router.push('/profile')}
//             >
//               Settings
//             </Button>
//           </View>
//         </CardContent>
//       </Card>

//       {/* Grievance Stats */}
//       {/* <Card style={styles.sectionCard}>
//         <CardHeader className='' title="Grievance Overview" />
//         <CardContent style={styles.statsContainer}>
//           <DashboardCard
//             title="Pending"
//             value={stats.pendingGrievances}
//             icon="alert-circle-outline"
//             variant="warning"
//             onPress={() => router.push('/grievances?filter=pending')}
//           />
//           <DashboardCard
//             title="Resolved"
//             value={stats.resolvedGrievances}
//             icon="checkmark-circle-outline"
//             variant="success"
//             onPress={() => router.push('/grievances?filter=resolved')}
//           />
//           <DashboardCard
//             title="Total"
//             value={stats.totalGrievances}
//             icon="document-text-outline"
//             variant="info"
//             onPress={() => router.push('/grievances')}
//           />
//         </CardContent>
//       </Card> */}
//       <View className="flex-row justify-between mb-5 p-4">
//         <View className="bg-amber-400 rounded-lg p-5 flex-1 m-1 items-center">
//           <Text className="text-2xl font-bold text-white">
//             {stats.totalGrievances}
//           </Text>
//           <Text className="text-white">Total</Text>
//         </View>
//         <View className="bg-amber-500 rounded-lg p-5 flex-1 m-1 items-center">
//           <Text className="text-2xl font-bold text-white">
//             {stats.pendingGrievances}
//           </Text>
//           <Text className="text-white">Pending</Text>
//         </View>
//         <View className="bg-amber-600 rounded-lg p-5 flex-1 m-1 items-center">
//           <Text className="text-2xl font-bold text-white">
//             {stats.resolvedGrievances}
//           </Text>
//           <Text className="text-white">Resolved</Text>
//         </View>
//       </View>
//       {/* Attendance Stats */}
//       <Card style={styles.sectionCard}>
//         <CardHeader title="Attendance Overview" />
//         <CardContent style={styles.statsContainer}>
//           <DashboardCard
//             title="Avg. Attendance"
//             value={`${stats.averageAttendance}%`}
//             icon="analytics-outline"
//             variant="info"
//             onPress={() => router.push('/attendance/reports')}
//           />
//           <DashboardCard
//             title="Low Attendance"
//             value={stats.lowAttendanceStudents}
//             icon="warning-outline"
//             variant="error"
//             onPress={() => router.push('/attendance/low')}
//           />
//           <DashboardCard
//             title="Total Students"
//             value={stats.totalStudents}
//             icon="people-outline"
//             variant="primary"
//             onPress={() => router.push('/attendance/students')}
//           />
//         </CardContent>
//       </Card>
//     </ScrollView>
//   </ThemedView>
// );