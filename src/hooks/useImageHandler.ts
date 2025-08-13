
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageSettings } from '@/types/imageGenerator';
import { loadImageFromUrl } from '@/utils/imageUtils';

export const useImageHandler = (settings: ImageSettings, setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>) => {
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPasteEnabled, setIsPasteEnabled] = useState(false);
  const [pasteTarget, setPasteTarget] = useState<'logo' | 'background' | 'frame'>('background');

  // Add paste event listener
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      console.log('Paste event triggered, isPasteEnabled:', isPasteEnabled);
      
      if (!isPasteEnabled) {
        console.log('Paste is disabled, ignoring event');
        return;
      }
      
      const items = e.clipboardData?.items;
      console.log('Clipboard items:', items ? items.length : 'none');
      
      if (!items) {
        console.log('No clipboard items found');
        return;
      }

      let foundImage = false;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`Item ${i}: type=${item.type}, kind=${item.kind}`);
        
        if (item.type.indexOf('image') !== -1) {
          foundImage = true;
          e.preventDefault();
          console.log('Found image, processing...');
          
          const file = item.getAsFile();
          console.log('File from clipboard:', file);
          
          if (file) {
            console.log(`Processing image file: ${file.name}, size: ${file.size}, type: ${file.type}`);
            processImageFile(file, pasteTarget);
            const targetName = pasteTarget === 'logo' ? 'logo' : pasteTarget === 'frame' ? 'khung' : 'nền';
            toast.success(`Đã dán ảnh ${targetName} thành công!`);
          } else {
            console.log('Could not get file from clipboard item');
            toast.error('Không thể lấy file ảnh từ clipboard');
          }
          break;
        }
      }
      
      if (!foundImage) {
        console.log('No image found in clipboard');
        toast.error('Clipboard không chứa ảnh. Hãy copy một ảnh trước khi paste.');
      }
    };

    console.log('Adding paste event listener');
    document.addEventListener('paste', handlePaste);
    return () => {
      console.log('Removing paste event listener');
      document.removeEventListener('paste', handlePaste);
    };
  }, [isPasteEnabled, pasteTarget, setSettings]);

  // Handle copy to clipboard functionality
  const copyImageToClipboard = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
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

  const processImageFile = (file: File, type: 'logo' | 'background' | 'frame') => {
    const maxSize = type === 'logo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    const sizeText = type === 'logo' ? '5MB' : '10MB';
    
    if (file.size > maxSize) {
      toast.error(`File quá lớn. Vui lòng chọn file nhỏ hơn ${sizeText}`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setSettings(prev => ({
          ...prev,
          logoFile: file,
          logoUrl: e.target?.result as string
        }));
      } else if (type === 'frame') {
        setSettings(prev => ({
          ...prev,
          frameFile: file,
          frameUrl: e.target?.result as string
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          backgroundImageFile: file,
          backgroundImageUrl: e.target?.result as string,
          backgroundUrlInput: ''
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file, 'logo');
    }
  };

  const handleFrameUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file, 'frame');
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file, 'background');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file: File) => file.type.startsWith('image/'));
    
    if (imageFile) {
      processImageFile(imageFile, 'background');
      toast.success('Đã tải ảnh nền thành công!');
    } else {
      toast.error('Vui lòng kéo thả file ảnh');
    }
  };

  const handleBackgroundUrlLoad = async () => {
    if (!settings.backgroundUrlInput.trim()) {
      toast.error('Vui lòng nhập URL hình ảnh');
      return;
    }

    setIsLoadingUrl(true);

    try {
      let imageUrl = settings.backgroundUrlInput;
      
      if (imageUrl.includes('unsplash.com/photos/')) {
        const photoId = imageUrl.split('/photos/')[1].split('?')[0].split('/')[0];
        imageUrl = `https://images.unsplash.com/photo-${photoId}?w=1200&h=800&fit=crop`;
      } else if (imageUrl.includes('pixabay.com') && !imageUrl.includes('cdn.pixabay')) {
        toast.error('Vui lòng sử dụng URL ảnh trực tiếp từ Pixabay (click chuột phải vào ảnh và chọn "Copy image address")');
        setIsLoadingUrl(false);
        return;
      }

      console.log('Attempting to load image from URL:', imageUrl);

      const proxyServices = [
        imageUrl,
        `https://cors-anywhere.herokuapp.com/${imageUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`,
        imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'crossorigin=anonymous'
      ];

      let success = false;
      let lastError = '';

      for (const [index, proxyUrl] of proxyServices.entries()) {
        try {
          console.log(`Trying method ${index + 1}:`, proxyUrl);
          const dataUrl = await loadImageFromUrl(proxyUrl);
          
          setSettings(prev => ({
            ...prev,
            backgroundImageUrl: dataUrl,
            backgroundImageFile: null
          }));
          
          toast.success('Tải ảnh từ URL thành công!');
          success = true;
          break;
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Unknown error';
          console.log(`Method ${index + 1} failed:`, lastError);
          
          if (index === 0 && lastError.includes('CORS')) {
            console.log('CORS issue detected, trying proxy methods...');
          }
        }
      }

      if (!success) {
        console.error('All loading methods failed. Last error:', lastError);
        
        let errorMessage = 'Không thể tải ảnh từ URL này. ';
        
        if (settings.backgroundUrlInput.includes('google.com')) {
          errorMessage += 'Google Images không cho phép tải trực tiếp. Hãy thử ảnh từ Unsplash hoặc Pixabay.';
        } else if (settings.backgroundUrlInput.includes('facebook.com') || settings.backgroundUrlInput.includes('instagram.com')) {
          errorMessage += 'Ảnh từ Facebook/Instagram không thể tải được. Hãy thử nguồn khác.';
        } else if (settings.backgroundUrlInput.includes('docunhanphuoc.com')) {
          errorMessage += 'Website này không cho phép tải ảnh trực tiếp. Hãy tải ảnh về máy rồi upload lên.';
        } else {
          errorMessage += 'Thử: 1) Dùng ảnh từ Unsplash.com, 2) Click chuột phải → "Copy image address", 3) Hoặc tải ảnh lên máy.';
        }
        
        toast.error(errorMessage);
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Có lỗi không xác định. Vui lòng thử lại hoặc dùng ảnh khác.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  return {
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
  };
};
