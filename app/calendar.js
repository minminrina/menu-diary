//2271100

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

const normalizeDate = (str) => {
  // Accepts: YYYY-MM-DD OR M/D/YYYY
  if (str.includes("-")) return str;

  const [month, day, year] = str.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export default function CalendarScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadMeals = async () => {
        const saved = await AsyncStorage.getItem("meals");
        if (active) setMeals(saved ? JSON.parse(saved) : []);
      };
      loadMeals();
      return () => {
        active = false;
      };
    }, [])
  );

  const dayMeals = meals.filter((m) => normalizeDate(m.date) === selectedDate);
  const markedDates = {};
  meals.forEach((m) => {
    markedDates[normalizeDate(m.date)] = { marked: true, dotColor: "#FF7DA9" };
  });

  const onDaySelect = (day) => {
    const date = day.dateString;
    setSelectedDate(date);

  };

  const renderMeal = ({ item }) => (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}
    >
      <Text style={styles.mealName}>{item.title} · ★{item.rating}</Text>
      <Text style={styles.sub}>{item.mood}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 My Food Calendar</Text>

      <Calendar
        onDayPress={onDaySelect}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: "#FF9DBD",
            },
          } : {}),
        }}
        theme={{
          todayTextColor: "#FF6F95",
          selectedDayBackgroundColor: "#FF9DBD",
          arrowColor: "#FF6F95",
          monthTextColor: "#FF6F95",
        }}
        style={styles.calendar}
      />

      <Text style={styles.sectionTitle}>
        🍽 {selectedDate || "날짜를 선택하세요"}
      </Text>

      {/* ADD NEW MEAL TO THIS DATE */}
      {selectedDate !== "" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push({ pathname: "/add", params: { date: selectedDate } })}
        >
          <Text style={styles.addText}>＋ 이 날짜에 기록 추가하기</Text>
        </TouchableOpacity>
      )}

      {/* LIST OF MEALS FOR SELECTED DATE */}
      {dayMeals.length === 0 ? (
        <Text style={styles.empty}>기록이 없어요 💗</Text>
      ) : (
        <FlatList
          data={dayMeals}
          renderItem={renderMeal}
          keyExtractor={(m) => m.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FA",
    padding: 29,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF7DA9",
    textAlign: "center",
    marginBottom: 10,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6F95",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#FFB3C6",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  addText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#AAA",
    marginTop: 10,
  },
  mealCard: {
    backgroundColor: "#FFE4EF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    color: "#FF6F95",
    fontWeight: "600",
  },
  sub: {
    color: "#777",
  },
});
