
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image } from 'lucide-react';
import { ImageSettings } from '@/types/imageGenerator';

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
            <Button onClick={onDownloadImage} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Tải xuống ảnh
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreviewPanel;
