
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, Copy } from 'lucide-react';
import { ImageSettings } from '@/types/imageGenerator';
import { toast } from 'sonner';

interface ImagePreviewPanelProps {
  generatedImageUrl: string;
  settings: ImageSettings;
  onDownloadImage: () => void;
}

const ImagePreviewPanel: React.FC<ImagePreviewPanelProps> = ({
  generatedImageUrl,
  settings,
  onDownloadImage
}) => {
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
            <div className="space-y-2">
              <Button onClick={onDownloadImage} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Tải xuống ảnh
              </Button>
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
