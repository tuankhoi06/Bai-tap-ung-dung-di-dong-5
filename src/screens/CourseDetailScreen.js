import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import api from "../api/mockApi";
import { Video } from "expo-av";
import { Image } from "expo-image";

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const resCourse = await api.get(`/courses/${courseId}`);
      setCourse(resCourse.data);

      const resCategories = await api.get("/categories");
      const cat = resCategories.data.find(
        (c) => c.id === resCourse.data.categoryId
      );
      setCategoryName(cat ? cat.name : "Không rõ");
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được chi tiết khóa học", [
        {
          text: "Quay lại",
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, []);

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khóa học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/courses/${courseId}`);
            Alert.alert("Thành công", "Đã xóa khóa học");
            navigation.navigate("CourseList");
          } catch (error) {
            Alert.alert("Lỗi", "Xóa khóa học thất bại");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.category}>Danh mục: {categoryName}</Text>
      <Text style={styles.price}>Giá: {course.price.toLocaleString()} VND</Text>
      <Image
        source={{ uri: course.thumbnailUrl }}
        style={styles.thumbnail}
        contentFit="cover"
        placeholder={require("../../assets/placeholder.png")}
      />
      <Text style={styles.description}>{course.description}</Text>

      <Text style={styles.trailerLabel}>Trailer khóa học</Text>
      <Video
        source={{ uri: course.trailerUrl }}
        useNativeControls
        resizeMode="contain"
        style={styles.video}
      />

      <View style={styles.buttons}>
        <Button
          title="Sửa khóa học"
          onPress={() => navigation.navigate("CourseForm", { courseId })}
        />
        <Button title="Xóa khóa học" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 16, color: "#666", marginBottom: 4 },
  price: { fontSize: 18, color: "#009688", marginBottom: 12 },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  trailerLabel: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
});
