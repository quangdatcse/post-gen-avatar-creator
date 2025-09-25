
import React, { useState } from 'react';
import { ImageSettings } from '@/types/imageGenerator';
import { useImageGenerator } from '@/hooks/useImageGenerator';
import ImageSettingsPanel from './ImageSettingsPanel';
import ImagePreviewPanel from './ImagePreviewPanel';
import Footer from './Footer';

const ArticleImageGenerator = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    title: '',
    width: 1200,
    height: 630,
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    logoFile: null,
    logoUrl: '',
    backgroundImageFile: null,
    backgroundImageUrl: '',
    backgroundUrlInput: '',
    frameFile: null,
    frameUrl: '',
    showTitle: true,
    showLogo: true,
    showLocationInfo: false,
    locationName: '',
    latitude: '',
    longitude: '',
    elevation: '',
    weatherInfo: '',
    designStyle: 'modern',
    textPosition: 'bottom',
    logoPosition: 'topRight',
    logoSize: 50,
    fontSize: 48,
    phoneNumber: '',
    showPhoneNumber: false,
    phoneFontSize: 24,
    enableOverlay: true // Mặc định bật overlay
  });
  
  const [backgroundInputMethod, setBackgroundInputMethod] = useState<'upload' | 'url'>('upload');

  const {
    isGenerating,
    generatedImageUrl,
    canvasRef,
    generateImage,
    downloadImage,
    downloadImageWebP,
    downloadImageJPEG,
    downloadImagePNG
  } = useImageGenerator();

  const handleGenerateImage = () => {
    generateImage(settings);
  };

  const handleDownloadImage = (format: 'png' | 'jpeg' | 'webp', quality?: number) => {
    switch (format) {
      case 'webp':
        downloadImageWebP(settings, quality);
        break;
      case 'jpeg':
        downloadImageJPEG(settings, quality);
        break;
      default:
        downloadImagePNG(settings);
    }
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
      
      <Footer />
    </div>
  );
};

export default ArticleImageGenerator;
