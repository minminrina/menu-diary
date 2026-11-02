//2271100

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 20;

export default function AnalyticsScreen() {
  const [meals, setMeals] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const moods = ["😍", "🤪", "😋", "🙂", "😟"];

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const saved = await AsyncStorage.getItem("meals");
    const parsed = saved ? JSON.parse(saved) : [];
    setMeals(parsed);
    setFiltered(parsed);
  };

  // ============================
  // FILTERS
  // ============================
  const filterByMood = (m) => {
    setFiltered(meals.filter((meal) => meal.mood === m));
  };

  const resetFilters = () => setFiltered(meals);

  // ============================
  // GRAPH DATA
  // ============================

  // Mood frequency
  const moodCount = moods.map(
    (mood) => filtered.filter((meal) => meal.mood === mood).length
  );

  // ⭐ Rating Trend (FIXED LABELS)
  const ratingData = filtered.map((m) => Number(m.rating));

  // labels: show only every 3rd point
  const ratingLabels = filtered.map((_, index) =>
    index % 3 === 0 ? String(index + 1) : ""
  );

  // Meals per weekday
  const weekdayCount = [0, 0, 0, 0, 0, 0, 0];
  filtered.forEach((m) => {
    const d = new Date(m.date);
    if (!isNaN(d)) weekdayCount[d.getDay()]++;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📈 Food Analytics</Text>

      {/* FILTERS */}
      <Text style={styles.sectionTitle}>🎭 Filter by Mood</Text>

      <View style={styles.filterRow}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => filterByMood(m)}
            style={styles.filterBtn}
          >
            <Text style={styles.filterText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
        <Text style={styles.resetText}>Reset Filters</Text>
      </TouchableOpacity>

      {/* MOOD CHART */}
      <Text style={styles.chartTitle}>Mood Frequency 💗</Text>
      <BarChart
        data={{
          labels: moods,
          datasets: [{ data: moodCount }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* ⭐ RATING TREND (CLEAN) */}
      <Text style={styles.chartTitle}>Rating Trend ⭐</Text>

      {filtered.length > 1 ? (
        <LineChart
          data={{
            labels: ratingLabels,
            datasets: [{ data: ratingData }],
          }}
          width={screenWidth}
          height={220}
          bezier
          chartConfig={chartConfig}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>데이터가 부족해요 🥺</Text>
      )}

      {/* WEEKDAY */}
      <Text style={styles.chartTitle}>Meals Per Weekday 🍽️</Text>
      <BarChart
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [{ data: weekdayCount }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFE5F0",
  backgroundGradientTo: "#FFF0F6",
  color: (opacity = 1) => `rgba(255, 105, 150, ${opacity})`,
  labelColor: () => "#FF6F91",
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FC",
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6F95",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6F91",
    marginBottom: 10,
    marginTop: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filterBtn: {
    backgroundColor: "#FFD6E6",
    padding: 10,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 22,
  },
  resetBtn: {
    alignSelf: "center",
    marginTop: 10,
  },
  resetText: {
    color: "#FF5F91",
    fontWeight: "600",
  },
  chartTitle: {
    marginTop: 20,
    fontSize: 20,
    color: "#FF6F95",
    fontWeight: "700",
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginTop: 10,
  },
  noData: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },
});