import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import api from "../api/mockApi";
import CategoryPicker from "../components/CategoryPicker";

const initialForm = {
  title: "",
  description: "",
  price: "",
  categoryId: "",
  thumbnailUrl: "",
  trailerUrl: "",
};

export default function CourseFormScreen({ route, navigation }) {
  const courseId = route.params?.courseId;
  const isEdit = !!courseId;

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCourse = async () => {
    if (!isEdit) return;
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setForm({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price.toString(),
        categoryId: res.data.categoryId,
        thumbnailUrl: res.data.thumbnailUrl,
        trailerUrl: res.data.trailerUrl,
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được dữ liệu khóa học", [
        { text: "Quay lại", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourse();
  }, []);

  const validate = () => {
    if (!form.title.trim()) {
      Alert.alert("Lỗi", "Tiêu đề không được để trống");
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert("Lỗi", "Mô tả không được để trống");
      return false;
    }
    if (!form.price.trim()) {
      Alert.alert("Lỗi", "Giá không được để trống");
      return false;
    }
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Lỗi", "Giá phải là số không âm");
      return false;
    }
    if (!form.categoryId) {
      Alert.alert("Lỗi", "Phải chọn danh mục");
      return false;
    }
    if (!categories.find((c) => c.id === form.categoryId)) {
      Alert.alert("Lỗi", "Danh mục không hợp lệ");
      return false;
    }
    if (!form.thumbnailUrl.trim()) {
      Alert.alert("Lỗi", "URL ảnh bìa không được để trống");
      return false;
    }
    if (!form.trailerUrl.trim()) {
      Alert.alert("Lỗi", "URL trailer không được để trống");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        categoryId: form.categoryId,
        thumbnailUrl: form.thumbnailUrl.trim(),
        trailerUrl: form.trailerUrl.trim(),
      };
      if (isEdit) {
        await api.put(`/courses/${courseId}`, payload);
        Alert.alert("Thành công", "Cập nhật khóa học thành công");
      } else {
        await api.post("/courses", payload);
        Alert.alert("Thành công", "Thêm khóa học thành công");
      }
      navigation.navigate("CourseList");
    } catch (error) {
      Alert.alert("Lỗi", "Lưu khóa học thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingCategories) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Tiêu đề *</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        placeholder="Nhập tiêu đề khóa học"
      />

      <Text style={styles.label}>Mô tả *</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        placeholder="Nhập mô tả"
        multiline
      />

      <Text style={styles.label}>Giá (VND) *</Text>
      <TextInput
        style={styles.input}
        value={form.price}
        onChangeText={(text) => setForm({ ...form, price: text })}
        placeholder="Nhập giá"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Danh mục *</Text>
      <CategoryPicker
        categories={categories}
        selectedCategoryId={form.categoryId}
        onValueChange={(value) => setForm({ ...form, categoryId: value })}
      />

      <Text style={styles.label}>URL ảnh bìa *</Text>
      <TextInput
        style={styles.input}
        value={form.thumbnailUrl}
        onChangeText={(text) => setForm({ ...form, thumbnailUrl: text })}
        placeholder="Nhập URL ảnh bìa"
        autoCapitalize="none"
      />

      {/* Xem trước ảnh bìa */}
      {form.thumbnailUrl.trim() !== "" && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Xem trước ảnh bìa:</Text>
          <Image
            source={{ uri: form.thumbnailUrl.trim() }}
            style={styles.previewImage}
            contentFit="cover"
            placeholder={require("../../assets/placeholder.png")}
          />
        </View>
      )}

      <Text style={styles.label}>URL trailer MP4 *</Text>
      <TextInput
        style={styles.input}
        value={form.trailerUrl}
        onChangeText={(text) => setForm({ ...form, trailerUrl: text })}
        placeholder="Nhập URL trailer"
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isEdit ? "Cập nhật" : "Thêm mới"}
          onPress={handleSubmit}
          color="#009688"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  label: { fontWeight: "600", marginTop: 15, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fafafa",
  },
  previewContainer: {
    marginTop: 10,
  },
  previewLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
