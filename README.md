# BookmarkAI Url Sync Extension

## RELEASE VERSION #1.0

BookmarkAI Url Sync là extension dùng để đồng bộ URL từ trình duyệt về hệ thống BookmarkAI. Extension này được cài đặt trực tiếp từ source code local, không cài thông qua Chrome Extension Store.

Extension hỗ trợ người dùng lưu và gửi thông tin trang đang xem về backend của BookmarkAI thông qua Extension Code. Khi người dùng truy cập các nền tảng được hỗ trợ như YouTube, Facebook, Reddit hoặc TikTok, extension có thể phát hiện đường dẫn hiện tại và gửi dữ liệu về hệ thống để phục vụ việc lưu bookmark, quản lý video, playlist và tra cứu nội dung sau này.

---

## 1. Yêu cầu trước khi cài đặt

Trước khi sử dụng extension, cần chuẩn bị:

* Trình duyệt hỗ trợ extension dạng Chromium, ví dụ:

  * Google Chrome
  * Microsoft Edge
  * Brave
  * Cốc Cốc
* Source code của dự án đã được tải về máy.
* Backend BookmarkAI nên được chạy trước khi test chức năng gửi dữ liệu.
* Người dùng cần có Extension Code hợp lệ từ hệ thống BookmarkAI.

Định dạng Extension Code:

```text
xxxx-123456
```

Trong đó:

* `xxxx`: 4 ký tự đầu, có thể là chữ hoặc số.
* `123456`: 6 chữ số cuối.

Ví dụ:

```text
a1b2-123456
```

---

## 2. Cách cài đặt extension local

### Bước 1: Tải source code về máy

Tải file source code của dự án về máy tính.

Nếu source code được cung cấp dưới dạng file `.zip`, hãy lưu file vào một thư mục dễ tìm, ví dụ:

```text
Downloads
Desktop
D:\Projects
```

---

### Bước 2: Giải nén file

Nhấn chuột phải vào file `.zip`, sau đó chọn:

```text
Extract All...
```

hoặc:

```text
Giải nén tại đây
```

Sau khi giải nén, trong thư mục dự án sẽ có thư mục extension.

Thư mục extension trong dự án này là:

```text
bookmarkai-url-sync-extension-v25
```

Lưu ý: Khi load extension, cần chọn đúng thư mục chứa file `manifest.json`.

---

### Bước 3: Mở trang quản lý extension trên trình duyệt

Mở trình duyệt bạn đang sử dụng, sau đó vào phần quản lý extension.

Với Google Chrome, có thể truy cập bằng một trong hai cách:

Cách 1:

```text
Menu ba chấm ở góc phải trên → Extensions → Manage Extensions
```

Cách 2:

Nhập đường dẫn sau vào thanh địa chỉ:

```text
chrome://extensions/
```

Với Microsoft Edge:

```text
edge://extensions/
```

Với Brave:

```text
brave://extensions/
```

Với Cốc Cốc:

```text
coccoc://extensions/
```

---

### Bước 4: Bật Developer Mode

Ở trang quản lý extension, bật chế độ:

```text
Developer mode
```

Nút này thường nằm ở góc phải trên hoặc góc trái trên, tùy trình duyệt.

Sau khi bật Developer Mode, trình duyệt sẽ hiện thêm các nút dành cho lập trình viên, trong đó có nút:

```text
Load unpacked
```

hoặc:

```text
Tải tiện ích đã giải nén
```

---

### Bước 5: Load extension vào trình duyệt

Nhấn nút:

```text
Load unpacked
```

Sau đó chọn thư mục extension đã giải nén:

```text
bookmarkai-url-sync-extension-v25
```

Quan trọng: Chỉ chọn thư mục extension, không chọn toàn bộ thư mục backend nếu trong đó có nhiều folder khác.

Thư mục được chọn phải chứa file:

```text
manifest.json
```

Nếu chọn đúng thư mục, extension sẽ xuất hiện trong danh sách extension của trình duyệt với tên:

```text
BookmarkAI Url Sync
```

---

### Bước 6: Ghim extension lên thanh công cụ

Sau khi load extension thành công, nhấn vào biểu tượng extension trên trình duyệt.

Nếu chưa thấy extension ở thanh công cụ:

1. Nhấn biểu tượng mảnh ghép Extensions.
2. Tìm `BookmarkAI Url Sync`.
3. Nhấn biểu tượng ghim để pin extension ra ngoài thanh công cụ.

Việc ghim extension giúp người dùng mở extension nhanh hơn khi cần nhập Extension Code hoặc kiểm tra trạng thái đồng bộ.

---

## 3. Cách sử dụng extension

### Bước 1: Mở extension

Nhấn vào biểu tượng:

```text
BookmarkAI Url Sync
```

trên thanh công cụ của trình duyệt.

Giao diện extension sẽ hiển thị các thông tin chính như:

* Trạng thái extension.
* Ô nhập Extension Code.
* Nút Save/Edit.
* Link gần nhất được phát hiện.
* Nút Copy link.
* Nút Go to web.

---

### Bước 2: Nhập Extension Code

Nhập Extension Code được cấp từ hệ thống BookmarkAI vào ô:

```text
Extension Code
```

Ví dụ:

```text
a1b2-123456
```

Sau đó nhấn:

```text
Save
```

Nếu code hợp lệ, extension sẽ lưu code vào trình duyệt. Sau khi lưu, ô nhập sẽ bị khóa lại để tránh người dùng sửa nhầm.

Nếu muốn đổi Extension Code, nhấn:

```text
Edit
```

sau đó nhập code mới và nhấn lại:

```text
Save
```

---

### Bước 3: Bật trạng thái Active

Trong giao diện extension có công tắc trạng thái.

Khi extension đang bật, trạng thái sẽ là:

```text
Active
```

Nếu tắt công tắc này, extension sẽ không tiếp tục gửi dữ liệu trang hiện tại về backend.

---

### Bước 4: Truy cập nền tảng được hỗ trợ

Sau khi nhập Extension Code và bật extension, người dùng có thể truy cập các nền tảng được hỗ trợ, ví dụ:

```text
YouTube
Facebook
Reddit
TikTok
```

Khi người dùng mở hoặc chuyển sang một nội dung mới, extension sẽ phát hiện URL hiện tại và gửi dữ liệu về API của hệ thống BookmarkAI.

---

### Bước 5: Kiểm tra link gần nhất

Trong popup của extension có phần:

```text
Latest Link
```

Phần này hiển thị đường dẫn gần nhất mà extension phát hiện được.

Người dùng có thể nhấn:

```text
Copy
```

để copy link đó.

---

### Bước 6: Mở website BookmarkAI

Trong extension có nút:

```text
Go to web
```

Khi nhấn vào nút này, trình duyệt sẽ mở website local của BookmarkAI:

```text
http://localhost:54343
```

Người dùng có thể vào website để đăng nhập, xem video/bookmark đã lưu, quản lý playlist và kiểm tra thông tin tài khoản.

---

## 4. Lưu ý khi sử dụng

* Extension này được cài bằng source code local, không phải bản phát hành trên Chrome Extension Store.
* Nếu trình duyệt hiển thị cảnh báo extension ở Developer Mode, đây là hành vi bình thường khi dùng extension local.
* Không xóa thư mục extension sau khi đã load vào trình duyệt. Nếu xóa hoặc đổi vị trí thư mục, extension có thể bị lỗi.
* Nếu sửa code extension, cần vào trang quản lý extension và nhấn nút Reload để tải lại bản mới.
* Backend cần chạy đúng port và đúng cấu hình API để extension gửi dữ liệu thành công.
* Nếu Extension Code không đúng định dạng hoặc không tồn tại trong hệ thống, extension sẽ không thể đồng bộ dữ liệu chính xác.

---

## 5. Mô tả dự án

BookmarkAI là hệ thống hỗ trợ người dùng lưu lại nội dung đã xem trên Internet, đặc biệt là các video hoặc bài viết từ những nền tảng phổ biến. Thay vì phải lưu thủ công từng đường dẫn, người dùng có thể sử dụng extension để tự động gửi URL về hệ thống. Sau đó, backend sẽ xử lý dữ liệu và lưu nội dung vào tài khoản tương ứng thông qua Extension Code.

Dự án được xây dựng theo mô hình backend API kết hợp với browser extension. Backend chịu trách nhiệm quản lý người dùng, xác thực tài khoản, video, tag, playlist, bookmark, thanh toán premium và dashboard thống kê. Extension đóng vai trò là cầu nối giữa trình duyệt của người dùng và hệ thống BookmarkAI, giúp quá trình lưu nội dung diễn ra nhanh và thuận tiện hơn.

Một chức năng quan trọng của hệ thống là quản lý video và playlist. Người dùng có thể lưu video, tìm kiếm theo tiêu đề hoặc tag, thêm video vào playlist và quản lý các playlist cá nhân. Hệ thống cũng có thể hỗ trợ tạo playlist tự động dựa trên tag, giúp nội dung được phân loại rõ ràng hơn và dễ tìm lại hơn.

Ngoài ra, dự án còn có phân quyền người dùng và quản trị viên. Người dùng thông thường có thể quản lý profile, Extension Code, bookmark và playlist của mình. Quản trị viên có thể xem danh sách người dùng, video, tag và các dữ liệu thống kê trong dashboard. Điều này giúp hệ thống phù hợp cho cả nhu cầu sử dụng cá nhân lẫn quản lý dữ liệu ở cấp hệ thống.

BookmarkAI hướng tới mục tiêu giúp người dùng tiết kiệm thời gian khi lưu trữ và tìm lại nội dung. Với extension local, người dùng có thể test nhanh chức năng đồng bộ URL trong môi trường phát triển mà không cần phải publish extension lên Chrome Extension Store.

---

## 6. Công nghệ sử dụng

Backend của dự án sử dụng:

```text
ASP.NET Core Web API
Entity Framework Core
MySQL
JWT Authentication
Repository-Service Pattern
VietQR / SePay payment integration
YouTube API
Google GenAI
```

Extension sử dụng:

```text
Chrome Extension Manifest V3
JavaScript
HTML
CSS
Chrome Storage API
Chrome Tabs API
```

---

## 7. Tóm tắt chức năng chính

Các chức năng chính của dự án gồm:

* Đăng ký và đăng nhập tài khoản.
* Xác thực bằng JWT.
* Quản lý thông tin người dùng.
* Tạo và thay đổi Extension Code.
* Lưu URL/video từ extension về backend.
* Quản lý video đã lưu.
* Tìm kiếm video theo tiêu đề, URL hoặc tag.
* Quản lý tag.
* Quản lý playlist.
* Thêm hoặc xóa video khỏi playlist.
* Thanh toán premium bằng VietQR/SePay.
* Kiểm tra thời hạn premium.
* Dashboard thống kê cho admin.
* Extension local để đồng bộ URL từ trình duyệt.

---

## 8. Cách kiểm tra extension sau khi cài

Sau khi cài extension local thành công:

1. Chạy backend BookmarkAI.
2. Mở website BookmarkAI.
3. Đăng nhập tài khoản người dùng.
4. Kiểm tra hoặc tạo Extension Code trong profile.
5. Mở extension trên trình duyệt.
6. Nhập Extension Code và nhấn Save.
7. Bật trạng thái Active.
8. Mở một video YouTube hoặc một trang được hỗ trợ.
9. Quay lại website BookmarkAI để kiểm tra dữ liệu đã được lưu.

Nếu dữ liệu chưa xuất hiện ngay, hãy chờ một lúc vì backend có thể cần thời gian để xử lý dữ liệu hoặc gọi API bên thứ ba.

---

## 9. Lỗi thường gặp

### Không thấy nút Load unpacked

Nguyên nhân thường là chưa bật Developer Mode.

Cách xử lý:

```text
Vào trang Manage Extensions → bật Developer Mode
```

---

### Load extension bị lỗi manifest

Nguyên nhân thường là chọn sai thư mục.

Cách xử lý:

Chọn đúng thư mục chứa file:

```text
manifest.json
```

Trong dự án này, thư mục cần chọn là:

```text
bookmarkai-url-sync-extension-v25
```

---

### Extension không gửi dữ liệu

Có thể do một trong các nguyên nhân sau:

* Backend chưa chạy.
* Extension Code sai hoặc chưa được lưu.
* Extension đang ở trạng thái inactive.
* API URL chưa đúng với môi trường đang chạy.
* Trình duyệt chưa được reload lại extension sau khi sửa code.

Cách xử lý:

1. Kiểm tra backend đã chạy chưa.
2. Kiểm tra Extension Code.
3. Bật trạng thái Active.
4. Vào trang Manage Extensions và nhấn Reload extension.
5. Thử mở lại trang nội dung cần lưu.

---

### Đổi code nhưng extension vẫn dùng code cũ

Cách xử lý:

1. Mở popup extension.
2. Nhấn Edit.
3. Nhập Extension Code mới.
4. Nhấn Save.
5. Reload lại trang đang xem nếu cần.

---

## 10. Ghi chú cho bản Release #1.0

Đây là bản release dùng để cài đặt và kiểm thử extension local. Người dùng không cần tải extension từ Chrome Extension Store. Chỉ cần tải source code, giải nén, bật Developer Mode và load thư mục extension vào trình duyệt.

Bản này phù hợp cho môi trường development, demo và kiểm thử chức năng đồng bộ URL giữa browser extension và backend BookmarkAI.
