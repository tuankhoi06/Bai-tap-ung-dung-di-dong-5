import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api/mockApi";
import CourseItem from "../components/CourseItem";
import CategoryPicker from "../components/CategoryPicker";

export default function CourseListScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được danh mục");
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được khóa học");
    } finally {
      setLoading(false);
    }
  };

  // Dùng useFocusEffect để tự động tải lại dữ liệu mỗi khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchCourses();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchCategories(), fetchCourses()]).finally(() =>
      setRefreshing(false)
    );
  }, []);

  // Lọc khóa học theo searchText và selectedCategoryId
  const filteredCourses = courses.filter((course) => {
    const matchTitle = course.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchCategory =
      selectedCategoryId === "" || course.categoryId === selectedCategoryId;
    return matchTitle && matchCategory;
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Không rõ";
  };

  const handleDeleteCourse = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khóa học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/courses/${id}`);
            setCourses((prev) => prev.filter((c) => c.id !== id));
          } catch (error) {
            Alert.alert("Lỗi", "Xóa khóa học thất bại");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button
          title="Quản lý danh mục"
          onPress={() => navigation.navigate("Category")}
        />
        <Button
          title="Thêm khóa học"
          onPress={() => navigation.navigate("CourseForm")}
        />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm khóa học..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <CategoryPicker
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onValueChange={setSelectedCategoryId}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#009688" style={{ marginTop: 20 }} />
      ) : filteredCourses.length === 0 ? (
        <Text style={styles.emptyText}>Không có khóa học phù hợp</Text>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <CourseItem
              course={item}
              categoryName={getCategoryName(item.categoryId)}
              onPress={() =>
                navigation.navigate("CourseDetail", { courseId: item.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  emptyText: {
    marginTop: 30,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
});
