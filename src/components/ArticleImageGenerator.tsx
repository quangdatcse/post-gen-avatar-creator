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

  const generateBackgroundPattern = (ctx: CanvasRenderingContext2D, title: string, width: number, height: number, backgroundColor: string) => {
    // Create a more sophisticated background based on title keywords
    const keywords = title.toLowerCase().split(' ');
    
    // Different patterns based on content
    if (keywords.some(word => ['tech', 'ai', 'digital', 'software', 'programming'].includes(word))) {
      // Tech pattern - geometric shapes
      ctx.fillStyle = `${backgroundColor}15`;
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 60 + 20;
        ctx.fillRect(x, y, size, size * 0.6);
      }
      
      // Add circuit-like lines
      ctx.strokeStyle = `${backgroundColor}25`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }
    } else if (keywords.some(word => ['business', 'finance', 'marketing', 'sales'].includes(word))) {
      // Business pattern - charts and bars
      ctx.fillStyle = `${backgroundColor}20`;
      for (let i = 0; i < 12; i++) {
        const x = (width / 12) * i;
        const barHeight = Math.random() * height * 0.3 + 50;
        ctx.fillRect(x, height - barHeight, width / 15, barHeight);
      }
    } else if (keywords.some(word => ['design', 'creative', 'art', 'ui', 'ux'].includes(word))) {
      // Creative pattern - organic shapes
      ctx.fillStyle = `${backgroundColor}18`;
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 80 + 30;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Default pattern - mixed geometric
      ctx.fillStyle = `${backgroundColor}20`;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 50 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
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

      // Fill background
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, settings.width, settings.height);

      // Add gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, settings.width, settings.height);
      gradient.addColorStop(0, `${settings.backgroundColor}90`);
      gradient.addColorStop(1, `${settings.backgroundColor}60`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, settings.width, settings.height);

      // Generate contextual background pattern
      generateBackgroundPattern(ctx, settings.title, settings.width, settings.height, settings.backgroundColor);

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
        // Add title at the bottom with larger font
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        // Increased font size
        const fontSize = Math.max(32, settings.width * 0.055);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Word wrap for title
        const words = settings.title.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        const maxWidth = settings.width * 0.85;
        
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
        
        // Position title at bottom with padding
        const lineHeight = fontSize * 1.2;
        const bottomPadding = 40;
        const totalTextHeight = lines.length * lineHeight;
        const startY = settings.height - bottomPadding - totalTextHeight + lineHeight;
        
        // Add semi-transparent background for better readability
        const textBgHeight = totalTextHeight + 30;
        const textBgGradient = ctx.createLinearGradient(0, settings.height - textBgHeight - bottomPadding + 15, 0, settings.height);
        textBgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textBgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = textBgGradient;
        ctx.fillRect(0, settings.height - textBgHeight - bottomPadding + 15, settings.width, textBgHeight);
        
        // Draw title text
        ctx.fillStyle = '#ffffff';
        lines.forEach((line, index) => {
          ctx.fillText(line, settings.width / 2, startY + index * lineHeight);
        });

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Add subtle decorative elements at top
        ctx.strokeStyle = '#ffffff30';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const decorY = settings.height * 0.15;
        ctx.moveTo(settings.width * 0.2, decorY);
        ctx.lineTo(settings.width * 0.8, decorY);
        ctx.stroke();

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
                <Label htmlFor="backgroundColor">Màu nền chủ đạo</Label>
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
