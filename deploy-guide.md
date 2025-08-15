# Hướng dẫn Deploy lên taoanh.quangdatmmo.com

## Lỗi giải nén và giải pháp

**Vấn đề:** File `taoanh-quangdatmmo.tar.gz` cũ có thể bị lỗi khi giải nén do cách tạo không đúng.

**Giải pháp:** Đã tạo lại cả file `tar.gz` và `zip` với cấu trúc đúng.

## Các tùy chọn file nén

Bạn có **2 tùy chọn** để upload:

### 1. File taoanh-quangdatmmo.tar.gz (Linux/Unix servers)
```bash
# Giải nén trên server
tar -xzf taoanh-quangdatmmo.tar.gz
```

### 2. File taoanh-quangdatmmo.zip (Universal)
```bash
# Giải nén trên server Linux
unzip taoanh-quangdatmmo.zip

# Hoặc dùng panel hosting để giải nén
```

## Hướng dẫn deploy chi tiết

### Bước 1: Upload file
- Upload một trong hai file: `taoanh-quangdatmmo.tar.gz` hoặc `taoanh-quangdatmmo.zip`
- Upload vào thư mục `public_html` của domain `taoanh.quangdatmmo.com`

### Bước 2: Giải nén
**Nếu dùng tar.gz:**
```bash
cd /path/to/public_html/taoanh
tar -xzf taoanh-quangdatmmo.tar.gz
rm taoanh-quangdatmmo.tar.gz
```

**Nếu dùng zip:**
```bash
cd /path/to/public_html/taoanh  
unzip taoanh-quangdatmmo.zip
rm taoanh-quangdatmmo.zip
```

### Bước 3: Kiểm tra files
Sau khi giải nén, thư mục sẽ chứa:
```
index.html          (file chính)
assets/             (CSS, JS files)
  ├── index-DegE12PK.css
  └── index-PaZM9HJZ.js
.htaccess           (cấu hình Apache)
web.config          (cấu hình IIS)
_redirects          (cấu hình Netlify)
favicon.ico
robots.txt
placeholder.svg
```

### Bước 4: Cấu hình domain
- Đảm bảo domain `taoanh.quangdatmmo.com` trỏ đến thư mục chứa `index.html`
- Kiểm tra SSL certificate đã được cài đặt

### Bước 5: Test website
- Truy cập: `https://taoanh.quangdatmmo.com`
- Kiểm tra các tính năng chính:
  - Upload/paste ảnh
  - Các style thiết kế
  - Download ảnh WebP
  - Copy/paste ảnh
  - Thêm khung
  - Toggle title/logo
  - Location metadata

## Kích thước files
- **tar.gz**: 147KB
- **zip**: 147KB

## Troubleshooting

### Nếu vẫn gặp lỗi giải nén:
1. Thử file .zip thay vì .tar.gz
2. Kiểm tra quyền thư mục (chmod 755)
3. Upload từng file một nếu cần thiết

### Nếu website không hiển thị:
1. Kiểm tra file `index.html` có tồn tại
2. Kiểm tra domain pointing
3. Kiểm tra SSL certificate
4. Kiểm tra file `.htaccess` (cho Apache)

## Server requirements
- **Apache**: Dùng file `.htaccess`
- **IIS**: Dùng file `web.config`  
- **Nginx**: Cần cấu hình manual cho client-side routing
- **Netlify**: Dùng file `_redirects`
