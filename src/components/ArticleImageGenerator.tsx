
import React, { useState } from 'react';
import { ImageSettings } from '@/types/imageGenerator';
import { useImageGenerator } from '@/hooks/useImageGenerator';
import ImageSettingsPanel from './ImageSettingsPanel';
import ImagePreviewPanel from './ImagePreviewPanel';

const ArticleImageGenerator = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    title: '',
    width: 1200,
    height: 630,
    backgroundColor: '#3b82f6',
    logoFile: null,
    logoUrl: '',
    backgroundImageFile: null,
    backgroundImageUrl: '',
    backgroundUrlInput: ''
  });
  
  const [backgroundInputMethod, setBackgroundInputMethod] = useState<'upload' | 'url'>('upload');

  const {
    isGenerating,
    generatedImageUrl,
    canvasRef,
    generateImage,
    downloadImage
  } = useImageGenerator();

  const handleGenerateImage = () => {
    generateImage(settings);
  };

  const handleDownloadImage = () => {
    downloadImage(settings);
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
          <ImageSettingsPanel
            settings={settings}
            setSettings={setSettings}
            backgroundInputMethod={backgroundInputMethod}
            setBackgroundInputMethod={setBackgroundInputMethod}
            onGenerateImage={handleGenerateImage}
            isGenerating={isGenerating}
          />

          <ImagePreviewPanel
            generatedImageUrl={generatedImageUrl}
            settings={settings}
            onDownloadImage={handleDownloadImage}
          />
        </div>

        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ArticleImageGenerator;
