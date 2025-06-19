
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image, Link } from 'lucide-react';
import { ImageSettings } from '@/types/imageGenerator';
import { useImageHandler } from '@/hooks/useImageHandler';

interface ImageSettingsPanelProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  backgroundInputMethod: 'upload' | 'url';
  setBackgroundInputMethod: React.Dispatch<React.SetStateAction<'upload' | 'url'>>;
  onGenerateImage: () => void;
  isGenerating: boolean;
}

const ImageSettingsPanel: React.FC<ImageSettingsPanelProps> = ({
  settings,
  setSettings,
  backgroundInputMethod,
  setBackgroundInputMethod,
  onGenerateImage,
  isGenerating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isLoadingUrl,
    isDragging,
    handleLogoUpload,
    handleBackgroundUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBackgroundUrlLoad
  } = useImageHandler(settings, setSettings);

  return (
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
          <Label>Ảnh nền</Label>
          <div className="mt-2 space-y-4">
            <div className="flex gap-2">
              <Button
                variant={backgroundInputMethod === 'upload' ? 'default' : 'outline'}
                onClick={() => setBackgroundInputMethod('upload')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload file
              </Button>
              <Button
                variant={backgroundInputMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setBackgroundInputMethod('url')}
                className="flex-1"
              >
                <Link className="w-4 h-4 mr-2" />
                URL ảnh
              </Button>
            </div>

            {backgroundInputMethod === 'upload' && (
              <div>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
                
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => backgroundInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    {isDragging ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây hoặc click để chọn'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {settings.backgroundImageFile ? settings.backgroundImageFile.name : 'Hỗ trợ JPG, PNG, GIF (tối đa 10MB)'}
                  </p>
                </div>
              </div>
            )}

            {backgroundInputMethod === 'url' && (
              <div className="space-y-2">
                <Input
                  placeholder="VD: https://images.unsplash.com/photo-xxx... hoặc URL ảnh bất kỳ"
                  value={settings.backgroundUrlInput}
                  onChange={(e) => setSettings(prev => ({...prev, backgroundUrlInput: e.target.value}))}
                />
                <Button
                  onClick={handleBackgroundUrlLoad}
                  disabled={!settings.backgroundUrlInput.trim() || isLoadingUrl}
                  className="w-full"
                >
                  <Link className="w-4 h-4 mr-2" />
                  {isLoadingUrl ? 'Đang tải...' : 'Tải ảnh từ URL'}
                </Button>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Cách dùng:</strong></p>
                  <p>• Unsplash: Copy URL trang ảnh (sẽ tự động chuyển đổi)</p>
                  <p>• Ảnh khác: Click chuột phải → "Copy image address"</p>
                  <p>• Hoặc paste bất kỳ URL ảnh nào từ web</p>
                </div>
              </div>
            )}

            {settings.backgroundImageUrl && (
              <div className="flex justify-center">
                <img 
                  src={settings.backgroundImageUrl} 
                  alt="Background preview" 
                  className="w-32 h-20 object-cover rounded border-2 border-gray-200"
                />
              </div>
            )}
          </div>
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
          onClick={onGenerateImage} 
          disabled={isGenerating || !settings.title.trim()}
          className="w-full h-12 text-lg"
        >
          {isGenerating ? 'Đang tạo ảnh...' : 'Tạo ảnh AI'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageSettingsPanel;
