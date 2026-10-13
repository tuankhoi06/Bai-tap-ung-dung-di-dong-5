import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import api from "../api/mockApi";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // State cho modal sửa danh mục
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống");
      return;
    }
    setAdding(true);
    try {
      await api.post("/categories", { name });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      Alert.alert("Lỗi", "Thêm danh mục thất bại");
    } finally {
      setAdding(false);
    }
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const name = editName.trim();
    if (!name) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/categories/${editingCategory.id}`, { name });
      setEditModalVisible(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật danh mục thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = (id) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa danh mục này? Nếu danh mục đang có khóa học sẽ không được xóa.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              // Kiểm tra khóa học theo categoryId
              const resCourses = await api.get(`/courses?categoryId=${id}`);
              if (resCourses.data.length > 0) {
                Alert.alert(
                  "Lỗi",
                  "Danh mục đang có khóa học, không thể xóa"
                );
                return;
              }
              await api.delete(`/categories/${id}`);
              fetchCategories();
            } catch (error) {
              Alert.alert("Lỗi", "Xóa danh mục thất bại");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên danh mục mới"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <Button
          title={adding ? "Đang thêm..." : "Thêm"}
          onPress={handleAddCategory}
          disabled={adding}
          color="#009688"
        />
      </View>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có danh mục nào</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleOpenEdit(item)}
                  style={styles.editBtn}
                >
                  <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCategory(item.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#ddd" }} />
          )}
        />
      )}

      {/* Modal sửa danh mục */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sửa danh mục</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tên danh mục"
            />
            <View style={styles.modalButtons}>
              <Button
                title="Hủy"
                color="#999"
                onPress={() => setEditModalVisible(false)}
              />
              <Button
                title={saving ? "Đang lưu..." : "Lưu"}
                color="#009688"
                onPress={handleSaveEdit}
                disabled={saving}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  addContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#fafafa",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  categoryName: {
    fontSize: 16,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#ff5252",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 30,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
