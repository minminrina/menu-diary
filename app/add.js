//2271100
//add meal screen

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export default function AddMeal() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const mealDate = (Array.isArray(date) ? date[0] : date) || today;
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const saveMeal = async () => {
    if (!title || !rating) {
      Alert.alert("필수 입력", "음식 이름과 별점은 필수예요 🍑");
      return;
    }

    const newMeal = {
      id: Date.now().toString(),
      title,
      mood,
      rating: Number(rating),
      date: mealDate,
      image,
    };

    const saved = await AsyncStorage.getItem("meals");
    const meals = saved ? JSON.parse(saved) : [];
    await AsyncStorage.setItem("meals", JSON.stringify([...meals, newMeal]));

    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🍰 Add New Meal</Text>
      <Text style={styles.label}>📅 {mealDate}</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <Text style={styles.placeholder}>📷 사진 선택하기</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>음식 이름</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>기분</Text>
      <TextInput style={styles.input} value={mood} onChangeText={setMood} />

      <Text style={styles.label}>별점 (1~5)</Text>
      <TextInput style={styles.input} value={rating} onChangeText={setRating} keyboardType="numeric" />

      <TouchableOpacity style={styles.saveBtn} onPress={saveMeal}>
        <Text style={styles.saveText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6FA",
    padding: 29,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FF6F95",
    marginBottom: 20,
  },
  imageBox: {
    height: 200,
    backgroundColor: "#FFE6EE",
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#FFACC9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholder: {
    color: "#FF79A8",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  label: {
    color: "#FF6F95",
    marginTop: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#FFD1E1",
  },
  saveBtn: {
    backgroundColor: "#FF9DBD",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
