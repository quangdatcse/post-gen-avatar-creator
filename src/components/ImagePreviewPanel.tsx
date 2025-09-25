
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Image, Copy, Settings, Info } from 'lucide-react';
import { ImageSettings } from '@/types/imageGenerator';
import { toast } from 'sonner';
import { getFormatInfo, estimateFileSizes, formatBytes } from '@/utils/compressionUtils';

interface ImagePreviewPanelProps {
  generatedImageUrl: string;
  settings: ImageSettings;
  onDownloadImage: (format: 'png' | 'jpeg' | 'webp', quality?: number) => void;
  onGenerateImage: () => void;
  isGenerating: boolean;
}

const ImagePreviewPanel: React.FC<ImagePreviewPanelProps> = ({
  generatedImageUrl,
  settings,
  onDownloadImage,
  onGenerateImage,
  isGenerating
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [imageQuality, setImageQuality] = useState<number>(80);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Estimate file sizes
  const fileSizeEstimates = estimateFileSizes(settings.width, settings.height);
  const currentFormatInfo = getFormatInfo(downloadFormat);
  // Handle copy generated image to clipboard
  const copyGeneratedImageToClipboard = async () => {
    if (!generatedImageUrl) return;
    
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        toast.success('Đã copy ảnh vào clipboard!');
      } else {
        toast.error('Trình duyệt không hỗ trợ copy ảnh');
      }
    } catch (error) {
      console.error('Error copying image:', error);
      toast.error('Không thể copy ảnh');
    }
  };
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Xem trước</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Generate button */}
          <Button 
            onClick={onGenerateImage} 
            disabled={isGenerating || (settings.showTitle && !settings.title.trim())}
            className="w-full h-12 text-lg"
          >
            {isGenerating ? 'Đang tạo ảnh...' : 'Tạo ảnh AI'}
          </Button>
          
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
            <div className="space-y-3">
              {/* Quick download buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => onDownloadImage('webp', 0.8)} 
                  className="text-sm"
                  variant="default"
                >
                  <Download className="w-3 h-3 mr-1" />
                  WebP (nén)
                </Button>
                <Button 
                  onClick={() => onDownloadImage('png')} 
                  variant="outline"
                  className="text-sm"
                >
                  <Download className="w-3 h-3 mr-1" />
                  PNG (gốc)
                </Button>
              </div>

              {/* Advanced download options */}
              <div className="border rounded-lg p-3 space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Tùy chọn nâng cao
                  </span>
                  <span>{showDownloadOptions ? '▲' : '▼'}</span>
                </Button>

                {showDownloadOptions && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Định dạng:</label>
                      <Select value={downloadFormat} onValueChange={(value: 'png' | 'jpeg' | 'webp') => setDownloadFormat(value)}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webp">WebP (nén tốt nhất)</SelectItem>
                          <SelectItem value="jpeg">JPEG (nén vừa)</SelectItem>
                          <SelectItem value="png">PNG (không nén)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Format info */}
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <Info className="w-3 h-3" />
                          <span className="font-medium">{currentFormatInfo.name}</span>
                        </div>
                        <p className="text-gray-600">{currentFormatInfo.description}</p>
                        <p className="text-gray-600">{currentFormatInfo.typical}</p>
                        <p className="font-medium mt-1">
                          Ước tính: ~{formatBytes(
                            downloadFormat === 'png' ? fileSizeEstimates.png :
                            downloadFormat === 'jpeg' ? fileSizeEstimates.jpeg_medium :
                            fileSizeEstimates.webp_medium
                          )}
                        </p>
                      </div>
                    </div>

                    {downloadFormat !== 'png' && (
                      <div>
                        <label className="text-sm font-medium">
                          Chất lượng: {imageQuality}%
                        </label>
                        <Slider
                          value={[imageQuality]}
                          onValueChange={(value) => setImageQuality(value[0])}
                          max={100}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Nén nhiều</span>
                          <span>Chất lượng cao</span>
                        </div>
                        
                        {/* Quality-based size estimate */}
                        <div className="mt-2 text-xs text-gray-600">
                          Ước tính với {imageQuality}%: ~{formatBytes(
                            downloadFormat === 'jpeg' 
                              ? fileSizeEstimates.jpeg_medium * (imageQuality / 80)
                              : fileSizeEstimates.webp_medium * (imageQuality / 75)
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => onDownloadImage(downloadFormat, downloadFormat === 'png' ? undefined : imageQuality / 100)} 
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống {downloadFormat.toUpperCase()}
                      {downloadFormat !== 'png' && ` (${imageQuality}%)`}
                    </Button>
                  </div>
                )}
              </div>

              <Button 
                onClick={copyGeneratedImageToClipboard} 
                variant="outline" 
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy ảnh
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreviewPanel;
