import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function CourseItem({ course, categoryName, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: course.thumbnailUrl }}
        style={styles.thumbnail}
        contentFit="cover"
        placeholder={require("../../assets/placeholder.png")}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{categoryName}</Text>
        <Text style={styles.price}>{course.price.toLocaleString()} VND</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  category: {
    color: "#666",
    marginTop: 4,
  },
  price: {
    marginTop: 6,
    color: "#009688",
    fontWeight: "600",
  },
});
