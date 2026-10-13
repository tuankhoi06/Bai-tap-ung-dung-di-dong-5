import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseListScreen from "../screens/CourseListScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import CourseFormScreen from "../screens/CourseFormScreen";
import CategoryScreen from "../screens/CategoryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="CourseList">
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: "Danh sách khóa học" }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: "Chi tiết khóa học" }}
      />
      <Stack.Screen
        name="CourseForm"
        component={CourseFormScreen}
        options={{ title: "Thêm / Sửa khóa học" }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: "Quản lý danh mục" }}
      />
    </Stack.Navigator>
  );
}
