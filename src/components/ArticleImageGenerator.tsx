import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, Download, Image } from 'lucide-react';

interface ImageSettings {
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  logoFile: File | null;
  logoUrl: string;
}

const ArticleImageGenerator = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    title: '',
    width: 1200,
    height: 630,
    backgroundColor: '#3b82f6',
    logoFile: null,
    logoUrl: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          logoFile: file,
          logoUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateContextualBackground = (ctx: CanvasRenderingContext2D, title: string, width: number, height: number, backgroundColor: string) => {
    const keywords = title.toLowerCase().split(' ');
    
    // Create a base gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(0.5, `${backgroundColor}90`);
    gradient.addColorStop(1, `${backgroundColor}70`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Generate contextual patterns based on title content
    if (keywords.some(word => ['technology', 'tech', 'ai', 'artificial', 'intelligence', 'digital', 'software', 'programming', 'code', 'computer', 'data'].includes(word))) {
      // Tech background - circuit patterns and geometric shapes
      ctx.save();
      ctx.globalAlpha = 0.3;
      
      // Circuit lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + (Math.random() - 0.5) * 200;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      // Tech nodes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    } else if (keywords.some(word => ['business', 'finance', 'marketing', 'sales', 'money', 'profit', 'corporate', 'company', 'management'].includes(word))) {
      // Business background - charts and professional elements
      ctx.save();
      ctx.globalAlpha = 0.25;
      
      // Bar charts
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 12; i++) {
        const x = (width / 12) * i + 20;
        const barHeight = Math.random() * height * 0.4 + 50;
        const barWidth = width / 20;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      }
      
      // Growth lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, height - 100);
      for (let i = 1; i < 10; i++) {
        const x = (width / 10) * i;
        const y = height - 100 - Math.random() * 200;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      ctx.restore();
    } else if (keywords.some(word => ['design', 'creative', 'art', 'ui', 'ux', 'graphics', 'visual', 'aesthetic', 'beauty', 'style'].includes(word))) {
      // Creative background - organic shapes and artistic elements
      ctx.save();
      ctx.globalAlpha = 0.2;
      
      // Organic shapes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Flowing lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.bezierCurveTo(
          Math.random() * width, Math.random() * height,
          Math.random() * width, Math.random() * height,
          Math.random() * width, Math.random() * height
        );
        ctx.stroke();
      }
      
      ctx.restore();
    } else if (keywords.some(word => ['travel', 'journey', 'adventure', 'explore', 'world', 'destination', 'vacation', 'trip'].includes(word))) {
      // Travel background - maps and location elements
      ctx.save();
      ctx.globalAlpha = 0.3;
      
      // Map grid
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      // Location pins
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    } else if (keywords.some(word => ['food', 'cooking', 'recipe', 'kitchen', 'chef', 'restaurant', 'eat', 'delicious', 'taste'].includes(word))) {
      // Food background - kitchen and culinary elements
      ctx.save();
      ctx.globalAlpha = 0.25;
      
      // Plate circles
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 60 + 30;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    } else {
      // Default background - abstract geometric patterns
      ctx.save();
      ctx.globalAlpha = 0.2;
      
      // Abstract shapes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 80 + 20;
        
        if (Math.random() > 0.5) {
          // Circles
          ctx.beginPath();
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rectangles
          ctx.fillRect(x, y, size, size * 0.7);
        }
      }
      
      ctx.restore();
    }
  };

  const generateImage = async () => {
    if (!settings.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = settings.width;
      canvas.height = settings.height;

      // Generate contextual background instead of solid color
      generateContextualBackground(ctx, settings.title, settings.width, settings.height, settings.backgroundColor);

      // Add logo if uploaded
      if (settings.logoUrl) {
        const logoImg = document.createElement('img');
        logoImg.onload = () => {
          const logoSize = Math.min(settings.width, settings.height) * 0.12;
          const logoX = settings.width - logoSize - 30;
          const logoY = 30;
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();
          
          drawTitleAndFinish();
        };
        logoImg.src = settings.logoUrl;
      } else {
        drawTitleAndFinish();
      }

      function drawTitleAndFinish() {
        // Add title at the very bottom
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        
        // Larger font size
        const fontSize = Math.max(36, settings.width * 0.06);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Word wrap for title
        const words = settings.title.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        const maxWidth = settings.width * 0.9;
        
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) lines.push(currentLine);
        
        // Position title at the very bottom
        const lineHeight = fontSize * 1.2;
        const bottomPadding = 20; // Reduced padding to move text closer to bottom
        const totalTextHeight = lines.length * lineHeight;
        
        // Add darker background for better text readability
        const textBgHeight = totalTextHeight + 40;
        const textBgGradient = ctx.createLinearGradient(0, settings.height - textBgHeight, 0, settings.height);
        textBgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textBgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = textBgGradient;
        ctx.fillRect(0, settings.height - textBgHeight, settings.width, textBgHeight);
        
        // Draw title text at the very bottom
        ctx.fillStyle = '#ffffff';
        const startY = settings.height - bottomPadding;
        
        lines.reverse().forEach((line, index) => {
          const y = startY - (index * lineHeight);
          ctx.fillText(line, settings.width / 2, y);
        });

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setGeneratedImageUrl(url);
            toast.success('Ảnh đã được tạo thành công!');
          }
        }, 'image/png');
      }
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Có lỗi xảy ra khi tạo ảnh');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    
    const link = document.createElement('a');
    link.download = `${settings.title.slice(0, 50)}-thumbnail.png`;
    link.href = generatedImageUrl;
    link.click();
    toast.success('Ảnh đã được tải xuống!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Article Thumbnail Generator
          </h1>
          <p className="text-xl text-gray-600">
            Tạo ảnh đại diện chuyên nghiệp cho bài viết của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Cài đặt ảnh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Textarea
                  id="title"
                  placeholder="Nhập tiêu đề bài viết của bạn..."
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({...prev, title: e.target.value}))}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label>Upload Logo</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {settings.logoFile ? settings.logoFile.name : 'Chọn logo'}
                  </Button>
                  {settings.logoUrl && (
                    <div className="mt-2 flex justify-center">
                      <img 
                        src={settings.logoUrl} 
                        alt="Logo preview" 
                        className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="backgroundColor">Màu chủ đạo cho nền</Label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="color"
                    id="backgroundColor"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings(prev => ({...prev, backgroundColor: e.target.value}))}
                    className="w-12 h-10 rounded border-2 border-gray-300"
                  />
                  <Input
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings(prev => ({...prev, backgroundColor: e.target.value}))}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Chiều rộng (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={settings.width}
                    onChange={(e) => setSettings(prev => ({...prev, width: parseInt(e.target.value) || 1200}))}
                    min="400"
                    max="2000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Chiều cao (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={settings.height}
                    onChange={(e) => setSettings(prev => ({...prev, height: parseInt(e.target.value) || 630}))}
                    min="300"
                    max="2000"
                    className="mt-2"
                  />
                </div>
              </div>

              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !settings.title.trim()}
                className="w-full h-12 text-lg"
              >
                {isGenerating ? 'Đang tạo ảnh...' : 'Tạo ảnh AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center bg-gray-50">
                  {generatedImageUrl ? (
                    <div className="text-center">
                      <img
                        src={generatedImageUrl}
                        alt="Generated thumbnail"
                        className="max-w-full max-h-[400px] rounded-lg shadow-lg mx-auto"
                      />
                      <p className="mt-4 text-sm text-gray-600">
                        Kích thước: {settings.width} x {settings.height}px
                      </p>
                      <p className="text-lg font-semibold mt-2 text-gray-800">
                        {settings.title}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Ảnh sẽ hiển thị ở đây sau khi tạo</p>
                    </div>
                  )}
                </div>

                {generatedImageUrl && (
                  <Button onClick={downloadImage} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống ảnh
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ArticleImageGenerator;
