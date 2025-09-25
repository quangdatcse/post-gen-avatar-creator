
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Image, Link, Clipboard, Copy, Settings, MapPin, Globe } from 'lucide-react';
import { ImageSettings } from '@/types/imageGenerator';
import { useImageHandler } from '@/hooks/useImageHandler';
import { getLocationInfo, getElevation, popularLocations } from '@/utils/locationUtils';
import { toast } from 'sonner';

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
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  
  const {
    isLoadingUrl,
    isDragging,
    isPasteEnabled,
    setIsPasteEnabled,
    pasteTarget,
    setPasteTarget,
    handleLogoUpload,
    handleFrameUpload,
    handleBackgroundUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBackgroundUrlLoad,
    copyImageToClipboard
  } = useImageHandler(settings, setSettings);

  const handleLocationLookup = async () => {
    if (!settings.locationName.trim()) {
      toast.error('Vui lòng nhập tên địa điểm trước');
      return;
    }

    setIsLoadingLocation(true);
    try {
      const locationInfo = await getLocationInfo(settings.locationName);
      if (locationInfo) {
        setSettings(prev => ({
          ...prev,
          latitude: locationInfo.latitude.toFixed(4),
          longitude: locationInfo.longitude.toFixed(4)
        }));

        // Try to get elevation
        try {
          const elevation = await getElevation(locationInfo.latitude, locationInfo.longitude);
          if (elevation !== null) {
            setSettings(prev => ({
              ...prev,
              elevation: elevation.toString()
            }));
          }
        } catch (elevationError) {
          console.warn('Could not fetch elevation:', elevationError);
        }

        toast.success('Đã lấy thông tin vị trí thành công!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy thông tin vị trí');
    } finally {
      setIsLoadingLocation(false);
    }
  };

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

        {/* Toggle Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Hiển thị thành phần</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showTitle"
                checked={settings.showTitle}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, showTitle: !!checked}))}
              />
              <Label htmlFor="showTitle" className="text-sm">Hiển thị tiêu đề</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showLogo"
                checked={settings.showLogo}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, showLogo: !!checked}))}
              />
              <Label htmlFor="showLogo" className="text-sm">Hiển thị logo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showPhoneNumber"
                checked={settings.showPhoneNumber}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, showPhoneNumber: !!checked}))}
              />
              <Label htmlFor="showPhoneNumber" className="text-sm">Hiển thị số điện thoại</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showLocationInfo"
                checked={settings.showLocationInfo}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, showLocationInfo: !!checked}))}
              />
              <Label htmlFor="showLocationInfo" className="text-sm">Hiển thị thông tin vị trí</Label>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        {settings.showPhoneNumber && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                placeholder="Nhập số điện thoại..."
                value={settings.phoneNumber}
                onChange={(e) => setSettings(prev => ({...prev, phoneNumber: e.target.value}))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phoneFontSize">Kích thước chữ số điện thoại: {settings.phoneFontSize}px</Label>
              <Slider
                id="phoneFontSize"
                min={10}
                max={80}
                step={2}
                value={[settings.phoneFontSize]}
                onValueChange={(value) => setSettings(prev => ({...prev, phoneFontSize: value[0]}))}
                className="mt-2"
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enableOverlay"
            checked={settings.enableOverlay}
            onCheckedChange={(checked) => setSettings(prev => ({...prev, enableOverlay: !!checked}))}
          />
          <Label htmlFor="enableOverlay" className="text-sm">Lớp phủ màu đen</Label>
        </div>

        <div>
          <Label htmlFor="frameUpload" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Upload khung ảnh (tùy chọn)
          </Label>
          <div className="mt-2 space-y-2">
            <Input
              id="frameUpload"
              type="file"
              accept="image/*"
              onChange={handleFrameUpload}
              className="cursor-pointer"
            />
            {settings.frameUrl && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-green-700">✓ Đã tải khung thành công</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, frameFile: null, frameUrl: '' }))}
                >
                  Xóa khung
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Khung sẽ được áp lên trên ảnh của bạn. Nên dùng file PNG có nền trong suốt.
          </p>
        </div>

        {/* Location Info Section */}
        {settings.showLocationInfo && (
          <div className="space-y-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Thông tin vị trí
            </Label>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="locationName" className="text-sm">Tên địa điểm</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="locationName"
                    placeholder="VD: Hà Nội, Việt Nam"
                    value={settings.locationName}
                    onChange={(e) => setSettings(prev => ({...prev, locationName: e.target.value}))}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLocationLookup}
                    disabled={isLoadingLocation || !settings.locationName.trim()}
                    className="shrink-0"
                  >
                    {isLoadingLocation ? '...' : '🔍'}
                  </Button>
                </div>
                
                {/* Popular locations */}
                <div className="mt-2">
                  <Label className="text-xs text-gray-600">Địa điểm phổ biến:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {popularLocations.slice(0, 4).map((location) => (
                      <Button
                        key={location.name}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          locationName: location.name,
                          latitude: location.latitude.toFixed(4),
                          longitude: location.longitude.toFixed(4)
                        }))}
                      >
                        {location.name.split(',')[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="latitude" className="text-sm">Vĩ độ (Latitude)</Label>
                  <Input
                    id="latitude"
                    placeholder="21.0285"
                    value={settings.latitude}
                    onChange={(e) => setSettings(prev => ({...prev, latitude: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-sm">Kinh độ (Longitude)</Label>
                  <Input
                    id="longitude"
                    placeholder="105.8542"
                    value={settings.longitude}
                    onChange={(e) => setSettings(prev => ({...prev, longitude: e.target.value}))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="elevation" className="text-sm">Độ cao (m)</Label>
                  <Input
                    id="elevation"
                    placeholder="12"
                    value={settings.elevation}
                    onChange={(e) => setSettings(prev => ({...prev, elevation: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weatherInfo" className="text-sm">Thông tin thời tiết</Label>
                  <Input
                    id="weatherInfo"
                    placeholder="Nắng, 28°C"
                    value={settings.weatherInfo}
                    onChange={(e) => setSettings(prev => ({...prev, weatherInfo: e.target.value}))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600">
                Thông tin vị trí sẽ được ghi vào metadata EXIF của ảnh (không hiển thị trên ảnh)
              </span>
            </div>
          </div>
        )}

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

            {/* Paste functionality toggle */}
            <div className="p-3 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Cho phép dán ảnh (Ctrl+V)</span>
                </div>
                <Button
                  variant={isPasteEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setIsPasteEnabled(!isPasteEnabled);
                    if (!isPasteEnabled) {
                      toast.success('Đã bật tính năng paste! Bây giờ bạn có thể nhấn Ctrl+V để dán ảnh.');
                    } else {
                      toast.info('Đã tắt tính năng paste.');
                    }
                  }}
                >
                  {isPasteEnabled ? 'Đã bật' : 'Tắt'}
                </Button>
              </div>
              
              {isPasteEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pasteTarget" className="text-sm">Dán vào:</Label>
                    <Select value={pasteTarget} onValueChange={(value: 'logo' | 'background' | 'frame') => setPasteTarget(value)}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="background">Ảnh nền</SelectItem>
                        <SelectItem value="logo">Logo</SelectItem>
                        <SelectItem value="frame">Khung ảnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded border">
                    ✓ Paste đang hoạt động! Copy ảnh từ bất kỳ đâu và nhấn Ctrl+V (hoặc Cmd+V trên Mac).
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const permission = await navigator.permissions.query({name: 'clipboard-read' as PermissionName});
                        console.log('Clipboard permission:', permission.state);
                        
                        const clipboardItems = await navigator.clipboard.read();
                        console.log('Clipboard items:', clipboardItems);
                        
                        toast.info(`Clipboard permission: ${permission.state}, Items: ${clipboardItems.length}`);
                      } catch (error) {
                        console.log('Clipboard test error:', error);
                        toast.error('Không thể đọc clipboard. Hãy thử copy ảnh và paste bằng Ctrl+V.');
                      }
                    }}
                    className="text-xs"
                  >
                    Test Clipboard
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        // Thử đọc clipboard trực tiếp
                        const clipboardItems = await navigator.clipboard.read();
                        
                        for (const clipboardItem of clipboardItems) {
                          for (const type of clipboardItem.types) {
                            if (type.startsWith('image/')) {
                              const blob = await clipboardItem.getType(type);
                              const file = new File([blob], 'pasted-image.' + type.split('/')[1], { type });
                              
                              if (pasteTarget === 'logo') {
                                setSettings(prev => ({
                                  ...prev,
                                  logoFile: file,
                                  logoUrl: URL.createObjectURL(file)
                                }));
                              } else {
                                setSettings(prev => ({
                                  ...prev,
                                  backgroundImageFile: file,
                                  backgroundImageUrl: URL.createObjectURL(file),
                                  backgroundUrlInput: ''
                                }));
                              }
                              
                              toast.success(`Đã paste ảnh ${pasteTarget === 'logo' ? 'logo' : 'nền'} thành công!`);
                              return;
                            }
                          }
                        }
                        
                        toast.error('Không tìm thấy ảnh trong clipboard');
                      } catch (error) {
                        console.error('Manual paste error:', error);
                        toast.error('Không thể paste ảnh. Hãy thử copy ảnh và dùng Ctrl+V.');
                      }
                    }}
                    className="text-xs"
                  >
                    Paste Thủ Công
                  </Button>
                </div>
              )}
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
              <div className="space-y-2">
                <div className="flex justify-center">
                  <img 
                    src={settings.backgroundImageUrl} 
                    alt="Background preview" 
                    className="w-32 h-20 object-cover rounded border-2 border-gray-200"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyImageToClipboard(settings.backgroundImageUrl)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy ảnh
                  </Button>
                </div>
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
              <div className="mt-2 space-y-2">
                <div className="flex justify-center">
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo preview" 
                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyImageToClipboard(settings.logoUrl)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    Copy logo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Design Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Cài đặt thiết kế
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Phong cách thiết kế</Label>
              <Select 
                value={settings.designStyle} 
                onValueChange={(value: 'modern' | 'classic' | 'minimal' | 'gradient') => 
                  setSettings(prev => ({...prev, designStyle: value}))
                }
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern - Hiện đại với gradient và hiệu ứng</SelectItem>
                  <SelectItem value="classic">Classic - Truyền thống, chuyên nghiệp</SelectItem>
                  <SelectItem value="minimal">Minimal - Tối giản, sạch sẽ</SelectItem>
                  <SelectItem value="gradient">Gradient - Màu sắc gradient đậm đà</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vị trí tiêu đề</Label>
                <Select 
                  value={settings.textPosition} 
                  onValueChange={(value: 'bottom' | 'center' | 'top') => 
                    setSettings(prev => ({...prev, textPosition: value}))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom">Dưới cùng</SelectItem>
                    <SelectItem value="center">Giữa</SelectItem>
                    <SelectItem value="top">Trên cùng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vị trí logo</Label>
                <Select 
                  value={settings.logoPosition} 
                  onValueChange={(value: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft') => 
                    setSettings(prev => ({...prev, logoPosition: value}))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="topRight">Trên phải</SelectItem>
                    <SelectItem value="topLeft">Trên trái</SelectItem>
                    <SelectItem value="bottomRight">Dưới phải</SelectItem>
                    <SelectItem value="bottomLeft">Dưới trái</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Size Controls */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700">Điều chỉnh kích thước</h4>
              
              <div>
                <Label className="flex items-center justify-between">
                  <span>Kích thước chữ: {settings.fontSize}px</span>
                  <span className="text-xs text-gray-500">
                    {settings.fontSize < 40 ? 'Nhỏ' : settings.fontSize < 70 ? 'Vừa' : 'Lớn'}
                  </span>
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => setSettings(prev => ({...prev, fontSize: value[0]}))}
                  max={120}
                  min={20}
                  step={2}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20px</span>
                  <span>120px</span>
                </div>
              </div>

              {settings.logoUrl && (
                <div>
                  <Label className="flex items-center justify-between">
                    <span>Kích thước logo: {settings.logoSize}%</span>
                    <span className="text-xs text-gray-500">
                      {settings.logoSize < 30 ? 'Nhỏ' : settings.logoSize < 70 ? 'Vừa' : 'Lớn'}
                    </span>
                  </Label>
                  <Slider
                    value={[settings.logoSize]}
                    onValueChange={(value) => setSettings(prev => ({...prev, logoSize: value[0]}))}
                    max={100}
                    min={10}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
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

        <div>
          <Label htmlFor="textColor">Màu chữ</Label>
          <div className="mt-2 flex gap-2">
            <input
              type="color"
              id="textColor"
              value={settings.textColor}
              onChange={(e) => setSettings(prev => ({...prev, textColor: e.target.value}))}
              className="w-12 h-10 rounded border-2 border-gray-300"
            />
            <Input
              value={settings.textColor}
              onChange={(e) => setSettings(prev => ({...prev, textColor: e.target.value}))}
              placeholder="#ffffff"
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
          disabled={isGenerating || (settings.showTitle && !settings.title.trim())}
          className="w-full h-12 text-lg"
        >
          {isGenerating ? 'Đang tạo ảnh...' : 'Tạo ảnh AI'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageSettingsPanel;
