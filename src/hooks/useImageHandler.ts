
import { useState } from 'react';
import { toast } from 'sonner';
import { ImageSettings } from '@/types/imageGenerator';
import { loadImageFromUrl } from '@/utils/imageUtils';

export const useImageHandler = (settings: ImageSettings, setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>) => {
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processImageFile = (file: File, type: 'logo' | 'background') => {
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
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
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
    handleLogoUpload,
    handleBackgroundUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBackgroundUrlLoad
  };
};
