
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageSettings } from '@/types/imageGenerator';
import { generateContextualBackground } from '@/utils/backgroundGenerator';
import { convertToSlug } from '@/utils/imageUtils';

export const useImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [generatedImageData, setGeneratedImageData] = useState<ImageData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async (settings: ImageSettings) => {
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

      canvas.width = settings.width;
      canvas.height = settings.height;

      if (settings.backgroundImageUrl) {
        const backgroundImg = document.createElement('img');
        backgroundImg.onload = () => {
          const canvasRatio = settings.width / settings.height;
          const imageRatio = backgroundImg.naturalWidth / backgroundImg.naturalHeight;
          
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (imageRatio > canvasRatio) {
            drawHeight = settings.height;
            drawWidth = drawHeight * imageRatio;
            offsetX = (settings.width - drawWidth) / 2;
          } else {
            drawWidth = settings.width;
            drawHeight = drawWidth / imageRatio;
            offsetY = (settings.height - drawHeight) / 2;
          }
          
          ctx.drawImage(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);
          
          const overlay = ctx.createLinearGradient(0, settings.height * 0.7, 0, settings.height);
          overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
          overlay.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
          overlay.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
          ctx.fillStyle = overlay;
          ctx.fillRect(0, 0, settings.width, settings.height);
          
          drawLogoAndTitle();
        };
        backgroundImg.src = settings.backgroundImageUrl;
      } else {
        generateContextualBackground(ctx, settings.title, settings.width, settings.height, settings.backgroundColor);
        drawLogoAndTitle();
      }

      function drawLogoAndTitle() {
        if (settings.logoUrl) {
          const logoImg = document.createElement('img');
          logoImg.onload = () => {
            const maxLogoSize = Math.min(settings.width, settings.height) * 0.25;
            const logoAspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
            
            let logoWidth, logoHeight;
            if (logoAspectRatio > 1) {
              logoWidth = maxLogoSize;
              logoHeight = maxLogoSize / logoAspectRatio;
            } else {
              logoHeight = maxLogoSize;
              logoWidth = maxLogoSize * logoAspectRatio;
            }
            
            const logoX = settings.width - logoWidth - 30;
            const logoY = 30;
            
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            
            drawTitleAndFinish();
          };
          logoImg.src = settings.logoUrl;
        } else {
          drawTitleAndFinish();
        }
      }

      function drawTitleAndFinish() {
        if (!settings.backgroundImageUrl) {
          const textBgHeight = settings.height * 0.3;
          const textBgGradient = ctx.createLinearGradient(0, settings.height - textBgHeight, 0, settings.height);
          textBgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          textBgGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
          textBgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
          ctx.fillStyle = textBgGradient;
          ctx.fillRect(0, settings.height - textBgHeight, settings.width, textBgHeight);
        }

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        
        const fontSize = Math.max(42, settings.width * 0.065);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        const words = settings.title.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        const maxWidth = settings.width * 0.9;
        
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
        
        const lineHeight = fontSize * 1.2;
        const bottomPadding = 10;
        const startY = settings.height - bottomPadding;
        
        lines.reverse().forEach((line, index) => {
          const y = startY - (index * lineHeight);
          ctx.fillText(line, settings.width / 2, y);
        });

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setGeneratedImageUrl(url);
            // Lưu image data để có thể tạo các định dạng khác
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setGeneratedImageData(imageData);
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

  const downloadImage = (settings: ImageSettings, format: 'png' | 'jpeg' | 'webp' = 'png', quality: number = 0.9) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Không tìm thấy canvas để tải ảnh');
      return;
    }
    
    const filename = convertToSlug(settings.title) || 'thumbnail';
    let mimeType: string;
    let extension: string;
    
    switch (format) {
      case 'webp':
        mimeType = 'image/webp';
        extension = 'webp';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        extension = 'jpg';
        break;
      default:
        mimeType = 'image/png';
        extension = 'png';
        quality = 1.0; // PNG không sử dụng quality
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a');
        link.download = `${filename}.${extension}`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        // Hiển thị thông tin file
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        toast.success(`Ảnh ${format.toUpperCase()} đã được tải xuống! (${sizeMB}MB)`);
        
        // Cleanup URL
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      } else {
        toast.error(`Không thể tạo ảnh định dạng ${format.toUpperCase()}`);
      }
    }, mimeType, quality);
  };

  // Hàm tải ảnh WebP nén cao
  const downloadImageWebP = (settings: ImageSettings, quality: number = 0.8) => {
    downloadImage(settings, 'webp', quality);
  };

  // Hàm tải ảnh JPEG nén
  const downloadImageJPEG = (settings: ImageSettings, quality: number = 0.85) => {
    downloadImage(settings, 'jpeg', quality);
  };

  // Hàm tải ảnh PNG gốc
  const downloadImagePNG = (settings: ImageSettings) => {
    downloadImage(settings, 'png');
  };

  return {
    isGenerating,
    generatedImageUrl,
    canvasRef,
    generateImage,
    downloadImage
  };
};
