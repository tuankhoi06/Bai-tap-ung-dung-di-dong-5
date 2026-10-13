# Quản lý khóa học (Course Management) - React Native + Expo

## Mô tả
Ứng dụng quản lý khóa học với các chức năng:
- Danh sách khóa học, tìm kiếm, lọc theo danh mục
- Xem chi tiết khóa học, phát trailer MP4
- Thêm, sửa, xóa khóa học
- Quản lý danh mục khóa học, không cho xóa danh mục đang có khóa học
- Hiển thị loading, lỗi, danh sách rỗng
- Validate dữ liệu (bắt buộc, price không âm, categoryId hợp lệ)
- Lấy dữ liệu từ MockAPI (không hardcode)

## Công nghệ
- React Native + Expo
- Axios để gọi API
- React Navigation để điều hướng
- Expo AV để phát video
- React Native Picker để chọn danh mục
- Expo Image để hiển thị ảnh

## Cài đặt

1. Cài Node.js, VS Code, Expo CLI (nếu chưa có)
2. Tạo project mới hoặc copy source code này vào thư mục
3. Chạy lệnh cài thư viện:

```bash
npm install
```

4. Tạo project trên mockapi.io với 2 resource:
- categories (id, name)
- courses (id, title, description, price, categoryId, thumbnailUrl, trailerUrl)

5. Thêm ít nhất 3 danh mục và 10 khóa học mẫu với URL ảnh/video thật.
6. Thay `YOUR_PROJECT_ID` trong file `src/api/mockApi.js` thành ID project của bạn trên mockapi.io.
7. Chạy ứng dụng:

```bash
npx expo start
```

Quét QR code bằng app Expo Go trên điện thoại hoặc chạy trên emulator.

## Cấu trúc project

```text
CourseManagementApp/
├── src/
│   ├── api/
│   │   └── mockApi.js
│   ├── components/
│   │   ├── CourseItem.js
│   │   └── CategoryPicker.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── CategoryScreen.js
│   │   ├── CourseDetailScreen.js
│   │   ├── CourseFormScreen.js
│   │   └── CourseListScreen.js
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── assets/
│   └── placeholder.png
├── .gitignore
└── README.md
```

## Lưu ý
- Không xóa danh mục đang có khóa học
- Validate dữ liệu trước khi gửi lên API
- Hiển thị loading, lỗi, danh sách rỗng rõ ràng
