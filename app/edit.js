//2271100

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [meal, setMeal] = useState(null);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    loadMeal();
  }, []);

  const loadMeal = async () => {
    const saved = await AsyncStorage.getItem("meals");
    const meals = saved ? JSON.parse(saved) : [];
    const found = meals.find((m) => m.id === id);

    if (found) {
      setMeal(found);
      setTitle(found.title);
      setMood(found.mood);
      setRating(String(found.rating));
      setImage(found.image || "");
    }
  };

  // 📷 이미지 변경
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ 저장
  const saveChanges = async () => {
    const saved = await AsyncStorage.getItem("meals");
    let meals = saved ? JSON.parse(saved) : [];

    meals = meals.map((m) =>
      m.id === id
        ? {
            ...m,
            title,
            mood,
            rating: Number(rating),
            image,
          }
        : m
    );

    await AsyncStorage.setItem("meals", JSON.stringify(meals));

    Alert.alert("완료!", "기록이 수정되었어요 🍑", [
      {
        text: "OK",
        onPress: () => {
          // ⭐ ВОТ ЭТО ГЛАВНОЕ
          router.replace("/");
        },
      },
    ]);
  };

  if (!meal) return null;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>📷 사진 변경</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.meta}>📅 {meal.date}</Text>
      <Text style={styles.meta}>😊 기분: {mood}</Text>
      <Text style={styles.meta}>⭐ 별점: {rating} / 5</Text>

      <Text style={styles.label}>음식 이름</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>기분</Text>
      <TextInput style={styles.input} value={mood} onChangeText={setMood} />

      <Text style={styles.label}>별점 (1~5)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>수정 완료</Text>
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
  imageBox: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 220,
  },
  imageText: {
    textAlign: "center",
    padding: 80,
    backgroundColor: "#FFE4EF",
    color: "#FF6F95",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FF6F95",
    marginBottom: 10,
  },
  meta: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF6F95",
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
    marginTop: 30,
    backgroundColor: "#FF9DBD",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});