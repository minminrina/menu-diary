//2271100
//detail screen

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    loadMeal();
  }, []);

  const loadMeal = async () => {
    const saved = await AsyncStorage.getItem("meals");
    const meals = saved ? JSON.parse(saved) : [];
    const found = meals.find((m) => m.id === id);
    setMeal(found);
  };

  const deleteMeal = async () => {
    Alert.alert("삭제할까요?", "이 기록을 삭제합니다", [
      { text: "취소" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const saved = await AsyncStorage.getItem("meals");
          const meals = saved ? JSON.parse(saved) : [];
          const updated = meals.filter((m) => m.id !== id);
          await AsyncStorage.setItem("meals", JSON.stringify(updated));
          router.replace("/");
        },
      },
    ]);
  };

  if (!meal) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: meal.image }} style={styles.image} />

      <Text style={styles.title}>{meal.title}</Text>

      <Text style={styles.info}>📅 {meal.date}</Text>
      <Text style={styles.info}>😊 기분: {meal.mood}</Text>
      <Text style={styles.info}>⭐ 별점: {meal.rating} / 5</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push({ pathname: "/edit", params: { id } })}
        >
          <Text style={styles.btnText}>✏️ 수정하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteMeal}>
          <Text style={styles.btnText}>🗑️ 삭제하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FA",
    padding: 29,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6F95",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  editBtn: {
    backgroundColor: "#FFE0EC",
    padding: 16,
    borderRadius: 30,
    width: "47%",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#FFB3C6",
    padding: 16,
    borderRadius: 30,
    width: "47%",
    alignItems: "center",
  },
  btnText: {
    color: "#FF5F91",
    fontWeight: "600",
    fontSize: 16,
  },
});