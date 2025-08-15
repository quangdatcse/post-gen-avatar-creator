#!/bin/bash

# Deploy script cho taoanh.quangdatmmo.com
# Chạy: chmod +x deploy.sh && ./deploy.sh

echo "🚀 Bắt đầu deploy Post Gen Avatar Creator..."

# Build project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build success!"

# Tạo archive file để upload
echo "📦 Tạo file archive..."
cd dist
tar -czf ../taoanh-quangdatmmo.tar.gz .
cd ..

echo "✅ Đã tạo file taoanh-quangdatmmo.tar.gz"

echo "🎉 Deploy files sẵn sàng!"
echo ""
echo "📝 Hướng dẫn deploy:"
echo "1. Upload file taoanh-quangdatmmo.tar.gz lên server"
echo "2. Extract vào thư mục public_html/taoanh/"
echo "3. Hoặc upload toàn bộ thư mục dist/ lên server"
echo ""
echo "📂 Files cần upload từ thư mục dist/:"
echo "   - index.html"
echo "   - assets/ (toàn bộ thư mục)"
echo "   - .htaccess"
echo "   - web.config"
echo "   - _redirects"
echo "   - favicon.ico"
echo "   - robots.txt"
echo "   - placeholder.svg"
echo ""
echo "🔗 Website sẽ hoạt động tại: https://taoanh.quangdatmmo.com"
