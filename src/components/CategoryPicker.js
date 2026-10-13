import React from "react";
import { Picker } from "@react-native-picker/picker";

export default function CategoryPicker({
  categories,
  selectedCategoryId,
  onValueChange,
}) {
  return (
    <Picker
      selectedValue={selectedCategoryId}
      onValueChange={onValueChange}
      mode="dropdown"
    >
      <Picker.Item label="-- Chọn danh mục --" value="" />
      {categories.map((cat) => (
        <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
      ))}
    </Picker>
  );
}
