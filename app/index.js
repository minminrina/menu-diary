//2271100
//homescreen

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getWeekNumber = (dateString) => {
  const d = new Date(dateString);
  return Math.ceil(d.getDate() / 7);
};

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState([]);
  const [weekMeals, setWeekMeals] = useState(0);
  const [favoriteMood, setFavoriteMood] = useState("");
  const [todaySummary, setTodaySummary] = useState("");
  const [topMeals, setTopMeals] = useState([]);
  const [recommendedMeal, setRecommendedMeal] = useState(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const saved = await AsyncStorage.getItem("meals");
    const list = saved ? JSON.parse(saved) : [];
    setMeals(list);
    generateAnalytics(list);
  };

  const generateAnalytics = (data) => {
    if (data.length === 0) return;

    const now = new Date();
    const currentWeek = getWeekNumber(now.toISOString());

    setWeekMeals(
      data.filter((m) => getWeekNumber(m.date) === currentWeek).length
    );

    const moodCount = {};
    data.forEach((m) => {
      moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
    });
    setFavoriteMood(
      Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0]
    );

    const today = now.toISOString().split("T")[0];
    const todayMeals = data.filter((m) => m.date === today);
    setTodaySummary(
      todayMeals.length === 0
        ? "오늘은 아직 아무것도 기록하지 않았어요 🍑"
        : `오늘 ${todayMeals.length}개 음식을 기록했어요!`
    );

    const sorted = [...data].sort((a, b) => b.rating - a.rating);
    setTopMeals(sorted.slice(0, 3));
    setRecommendedMeal(sorted[0]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({ pathname: "/detail", params: { id: item.id } })
      }
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.mealName}>{item.title}</Text>
        <Text style={styles.subText}>{item.date}</Text>
        <Text style={styles.subText}>
          기분: {item.mood} · ★ {item.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🍑 My Food Diary Premium</Text>

      <TouchableOpacity
        style={styles.calendarBox}
        onPress={() => router.push("/calendar")}
      >
        <Text style={styles.calendarText}>📅 Calendar View</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsButton}
        onPress={() => router.push("/analytics")}
      >

  <Text style={styles.analyticsButtonText}>📊 Analytics</Text>
</TouchableOpacity>

      <View style={styles.analyticsBox}>
        <Text style={styles.sectionTitle}>📊 이번 주 요약</Text>
        <Text style={styles.analyticsText}>이번 주 기록한 음식: {weekMeals}개</Text>
        <Text style={styles.analyticsText}>가장 자주 느낀 기분: {favoriteMood} 💕</Text>
        <Text style={styles.analyticsText}>{todaySummary}</Text>
      </View>

      {recommendedMeal && (
        <TouchableOpacity
          style={styles.recommendBox}
          onPress={() =>
            router.push({ pathname: "/detail", params: { id: recommendedMeal.id } })
          }
        >
          <Text style={styles.sectionTitle}>✨ 오늘의 추천 메뉴</Text>
          {recommendedMeal.image && (
            <Image source={{ uri: recommendedMeal.image }} style={styles.recommendImg} />
          )}
          <Text style={styles.recommendName}>{recommendedMeal.title}</Text>
          <Text style={styles.recommendSub}>당신이 가장 좋아했던 음식이에요 💗</Text>
        </TouchableOpacity>
      )}

      <View style={styles.analyticsBox}>
        <Text style={styles.sectionTitle}>🏆 BEST 3</Text>
        {topMeals.map((m) => (
          <Text key={m.id} style={styles.analyticsText}>
            ★ {m.rating} — {m.title}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>📘 Recent Meals</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.addText}>＋ 추가하기</Text>
      </TouchableOpacity>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF6FB", padding: 29 },
  header: { fontSize: 30, fontWeight: "700", color: "#FF8AB0", marginBottom: 20 },
  calendarBox: {
    backgroundColor: "#FFD6E5",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  calendarText: { color: "#FF6F95", fontWeight: "600" },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#FF6F95", marginBottom: 10 },
  analyticsBox: {
    backgroundColor: "#FFE4EF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  analyticsButton: {
  backgroundColor: "#FFD6E5",
  paddingVertical: 14,
  borderRadius: 20,
  alignItems: "center",
  marginBottom: 16,
},

analyticsButtonText: {
  color: "#FF6F95",
  fontWeight: "600",
  fontSize: 16,
},

  analyticsText: { fontSize: 15, color: "#666", marginBottom: 4 },
  recommendBox: {
    backgroundColor: "#FFD9E8",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  recommendImg: { width: 180, height: 180, borderRadius: 18, marginVertical: 12 },
  recommendName: { fontSize: 22, fontWeight: "700", color: "#FF5F91" },
  recommendSub: { color: "#777" },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },
  image: { width: 70, height: 70, borderRadius: 12, marginRight: 15 },
  mealName: { fontSize: 18, fontWeight: "600", color: "#FF6F91" },
  subText: { fontSize: 14, color: "#777", marginTop: 2 },
  addButton: {
    backgroundColor: "#FFB3C6",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 20,
  },
  addText: { fontSize: 18, color: "white", fontWeight: "600" },
});