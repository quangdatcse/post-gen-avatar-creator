
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageSettings } from '@/types/imageGenerator';
import { generateContextualBackground } from '@/utils/backgroundGenerator';
import { convertToSlug, hexToRgb, rgbToHsl, hslToRgb } from '@/utils/imageUtils';
import { createImageWithMetadata } from '@/utils/exifUtils';

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
          // Nếu không hiển thị title và logo, vẽ ảnh gốc không overlay
          if (!settings.showTitle && !settings.showLogo) {
            drawOriginalBackground(ctx, backgroundImg, settings);
          } else {
            // Vẽ background với hiệu ứng blur và overlay
            drawEnhancedBackground(ctx, backgroundImg, settings);
          }
          drawLogoAndTitle();
        };
        backgroundImg.src = settings.backgroundImageUrl;
      } else {
        // Tạo background gradient đẹp mắt
        drawModernGradientBackground(ctx, settings);
        drawLogoAndTitle();
      }

      function drawOriginalBackground(ctx: CanvasRenderingContext2D, backgroundImg: HTMLImageElement, settings: ImageSettings) {
        // Vẽ ảnh gốc không có overlay, giữ nguyên tỷ lệ và chất lượng
        const canvasRatio = settings.width / settings.height;
        const imageRatio = backgroundImg.naturalWidth / backgroundImg.naturalHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imageRatio > canvasRatio) {
          // Ảnh rộng hơn canvas tỷ lệ
          drawHeight = settings.height;
          drawWidth = drawHeight * imageRatio;
          offsetX = (settings.width - drawWidth) / 2;
        } else {
          // Ảnh cao hơn canvas tỷ lệ
          drawWidth = settings.width;
          drawHeight = drawWidth / imageRatio;
          offsetY = (settings.height - drawHeight) / 2;
        }
        
        // Vẽ ảnh gốc không có filter
        ctx.drawImage(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);
      }

      function drawEnhancedBackground(ctx: CanvasRenderingContext2D, backgroundImg: HTMLImageElement, settings: ImageSettings) {
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
        
        // Vẽ background image
        ctx.drawImage(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);
        
        // Thêm overlay gradient sophisticatedơn
        const overlay = ctx.createLinearGradient(0, 0, 0, settings.height);
        overlay.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        overlay.addColorStop(0.3, 'rgba(0, 0, 0, 0.2)');
        overlay.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
        overlay.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, settings.width, settings.height);
        
        // Thêm vignette effect
        const vignette = ctx.createRadialGradient(
          settings.width / 2, settings.height / 2, 0,
          settings.width / 2, settings.height / 2, Math.max(settings.width, settings.height) * 0.8
        );
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, settings.width, settings.height);
      }

      function drawModernGradientBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        switch (settings.designStyle) {
          case 'classic':
            drawClassicBackground(ctx, settings);
            break;
          case 'minimal':
            drawMinimalBackground(ctx, settings);
            break;
          case 'gradient':
            drawGradientBackground(ctx, settings);
            break;
          default: // modern
            drawModernBackground(ctx, settings);
            break;
        }
      }

      function drawModernBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        // Tạo gradient background hiện đại với nhiều màu
        const mainColor = settings.backgroundColor;
        const gradients = createModernGradient(ctx, settings, mainColor);
        
        // Vẽ background gradient chính
        ctx.fillStyle = gradients.primary;
        ctx.fillRect(0, 0, settings.width, settings.height);
        
        // Thêm accent gradient
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = gradients.accent;
        ctx.fillRect(0, 0, settings.width, settings.height);
        
        // Thêm geometric patterns
        ctx.globalCompositeOperation = 'soft-light';
        drawGeometricPattern(ctx, settings);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
      }

      function drawClassicBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        const rgb = hexToRgb(settings.backgroundColor);
        if (!rgb) return;
        
        // Simple gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, settings.height);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
        gradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)}, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, settings.width, settings.height);
      }

      function drawMinimalBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        // Solid color or very subtle gradient
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, settings.width, settings.height);
        
        // Very subtle texture
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * settings.width;
          const y = Math.random() * settings.height;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      function drawGradientBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        const rgb = hexToRgb(settings.backgroundColor);
        if (!rgb) return;
        
        // Vibrant multi-color gradient
        const gradient = ctx.createLinearGradient(0, 0, settings.width, settings.height);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
        gradient.addColorStop(0.25, `rgba(${Math.min(255, rgb.r + 60)}, ${Math.max(0, rgb.g - 30)}, ${Math.min(255, rgb.b + 40)}, 1)`);
        gradient.addColorStop(0.5, `rgba(${Math.max(0, rgb.r - 30)}, ${Math.min(255, rgb.g + 60)}, ${Math.max(0, rgb.b - 20)}, 1)`);
        gradient.addColorStop(0.75, `rgba(${Math.min(255, rgb.r + 40)}, ${Math.max(0, rgb.g - 20)}, ${Math.min(255, rgb.b + 60)}, 1)`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, settings.width, settings.height);
        
        // Add radial overlay
        const radial = ctx.createRadialGradient(
          settings.width * 0.3, settings.height * 0.3, 0,
          settings.width * 0.7, settings.height * 0.7, settings.width
        );
        radial.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, settings.width, settings.height);
      }

      function createModernGradient(ctx: CanvasRenderingContext2D, settings: ImageSettings, baseColor: string) {
        // Chuyển đổi hex color thành RGB
        const rgb = hexToRgb(baseColor);
        if (!rgb) return { primary: baseColor, accent: baseColor };
        
        // Tạo các màu bổ sung
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const complementaryHsl = [(hsl[0] + 180) % 360, hsl[1], Math.min(hsl[2] + 0.2, 1)];
        const analogousHsl = [(hsl[0] + 30) % 360, Math.min(hsl[1] + 0.1, 1), Math.min(hsl[2] + 0.1, 1)];
        
        const complementary = hslToRgb(complementaryHsl[0], complementaryHsl[1], complementaryHsl[2]);
        const analogous = hslToRgb(analogousHsl[0], analogousHsl[1], analogousHsl[2]);
        
        // Primary gradient
        const primary = ctx.createLinearGradient(0, 0, settings.width, settings.height);
        primary.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
        primary.addColorStop(0.6, `rgba(${analogous.r}, ${analogous.g}, ${analogous.b}, 0.8)`);
        primary.addColorStop(1, `rgba(${complementary.r}, ${complementary.g}, ${complementary.b}, 0.9)`);
        
        // Accent gradient
        const accent = ctx.createRadialGradient(
          settings.width * 0.3, settings.height * 0.2, 0,
          settings.width * 0.7, settings.height * 0.8, settings.width * 0.8
        );
        accent.addColorStop(0, `rgba(${complementary.r}, ${complementary.g}, ${complementary.b}, 0.3)`);
        accent.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
        accent.addColorStop(1, `rgba(${analogous.r}, ${analogous.g}, ${analogous.b}, 0.2)`);
        
        return { primary, accent };
      }

      function drawGeometricPattern(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        
        // Vẽ các đường geometric
        const spacing = 80;
        for (let x = 0; x < settings.width; x += spacing) {
          for (let y = 0; y < settings.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + spacing * 0.7, y + spacing * 0.7);
            ctx.stroke();
          }
        }
        
        // Vẽ circles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * settings.width;
          const y = Math.random() * settings.height;
          const radius = 50 + Math.random() * 100;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      function drawLogoAndTitle() {
        if (settings.showLogo && settings.logoUrl) {
          const logoImg = document.createElement('img');
          logoImg.onload = () => {
            drawEnhancedLogo(ctx, logoImg, settings);
            if (settings.showTitle) {
              drawEnhancedTitle(ctx, settings);
            }
            drawFrameOverlay();
          };
          logoImg.src = settings.logoUrl;
        } else {
          if (settings.showTitle) {
            drawEnhancedTitle(ctx, settings);
          }
          drawFrameOverlay();
        }
      }

      function drawFrameOverlay() {
        if (settings.frameUrl) {
          const frameImg = document.createElement('img');
          frameImg.onload = () => {
            // Vẽ frame phủ toàn bộ canvas
            ctx.drawImage(frameImg, 0, 0, settings.width, settings.height);
            finishImage();
          };
          frameImg.src = settings.frameUrl;
        } else {
          finishImage();
        }
      }

      function drawEnhancedLogo(ctx: CanvasRenderingContext2D, logoImg: HTMLImageElement, settings: ImageSettings) {
        // Tính toán kích thước logo dựa trên slider
        const baseLogoSize = Math.min(settings.width, settings.height) * 0.25; // Base size
        const logoSizeMultiplier = settings.logoSize / 50; // 50% is default, so 50% = 1x
        const maxLogoSize = baseLogoSize * logoSizeMultiplier;
        
        const logoAspectRatio = logoImg.naturalWidth / logoImg.naturalHeight;
        
        let logoWidth, logoHeight;
        if (logoAspectRatio > 1) {
          logoWidth = maxLogoSize;
          logoHeight = maxLogoSize / logoAspectRatio;
        } else {
          logoHeight = maxLogoSize;
          logoWidth = maxLogoSize * logoAspectRatio;
        }
        
        // Tính toán vị trí logo dựa trên settings
        let logoX, logoY;
        const padding = 40;
        
        switch (settings.logoPosition) {
          case 'topLeft':
            logoX = padding;
            logoY = padding;
            break;
          case 'topRight':
            logoX = settings.width - logoWidth - padding;
            logoY = padding;
            break;
          case 'bottomLeft':
            logoX = padding;
            logoY = settings.height - logoHeight - padding;
            break;
          case 'bottomRight':
            logoX = settings.width - logoWidth - padding;
            logoY = settings.height - logoHeight - padding;
            break;
          default:
            logoX = settings.width - logoWidth - padding;
            logoY = padding;
        }
        
        // Vẽ shadow cho logo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        // Vẽ logo với border tròn
        ctx.save();
        const radius = Math.min(logoWidth, logoHeight) * 0.1;
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoWidth, logoHeight, radius);
        ctx.clip();
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
        ctx.restore();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      function drawEnhancedTitle(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        if (!settings.showTitle || !settings.title.trim()) return;
        
        // Thiết lập font dựa trên design style và user's fontSize setting
        const baseFontSize = settings.fontSize; // Sử dụng fontSize từ slider
        let fontWeight = '900';
        let fontFamily = '"Inter", "Helvetica Neue", Arial, sans-serif';
        
        switch (settings.designStyle) {
          case 'classic':
            fontFamily = '"Times New Roman", Georgia, serif';
            fontWeight = 'bold';
            break;
          case 'minimal':
            fontFamily = '"Helvetica Neue", Arial, sans-serif';
            fontWeight = '300';
            break;
          case 'gradient':
            fontWeight = '900';
            break;
        }
        
        ctx.font = `${fontWeight} ${baseFontSize}px ${fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Chia text thành nhiều dòng thông minh
        const words = settings.title.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        const maxWidth = settings.width * 0.85;
        const padding = settings.width * 0.075;
        
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
        
        // Tính toán vị trí text dựa trên settings
        const lineHeight = baseFontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        let startY: number;
        
        switch (settings.textPosition) {
          case 'top':
            startY = padding;
            break;
          case 'center':
            startY = (settings.height - totalTextHeight) / 2;
            break;
          case 'bottom':
          default:
            startY = settings.height - totalTextHeight - padding;
            break;
        }
        
        // Vẽ background cho text dựa trên design style và position
        if (settings.designStyle !== 'minimal') {
          drawTextBackground(ctx, settings, startY, totalTextHeight, padding);
        }
        
        // Vẽ từng dòng text với style phù hợp
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          drawStyledText(ctx, line, padding, y, settings);
        });
        
        // Reset effects
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      function drawTextBackground(ctx: CanvasRenderingContext2D, settings: ImageSettings, startY: number, totalTextHeight: number, padding: number) {
        const textBgHeight = totalTextHeight + padding * 1.5;
        let gradient;
        
        switch (settings.designStyle) {
          case 'classic':
            gradient = ctx.createLinearGradient(0, startY - padding * 0.75, 0, startY + textBgHeight);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            break;
          case 'gradient':
            gradient = ctx.createLinearGradient(0, startY - padding * 0.75, settings.width, startY + textBgHeight);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(30, 30, 60, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            break;
          default: // modern
            gradient = ctx.createLinearGradient(0, startY - padding * 0.75, 0, startY + textBgHeight);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            break;
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, startY - padding * 0.75, settings.width, textBgHeight);
      }

      function drawStyledText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, settings: ImageSettings) {
        switch (settings.designStyle) {
          case 'classic':
            // Classic text with simple shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = settings.textColor;
            ctx.fillText(text, x, y);
            break;
            
          case 'minimal':
            // Clean minimal text
            ctx.fillStyle = settings.textColor;
            ctx.fillText(text, x, y);
            break;
            
          case 'gradient':
            // Gradient text with base color
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            const textGradient = ctx.createLinearGradient(x, y, x + ctx.measureText(text).width, y);
            const baseColor = hexToRgb(settings.textColor);
            if (baseColor) {
              const [h, s, l] = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
              const lighter = hslToRgb(h, s, Math.min(l + 0.3, 1));
              const darker = hslToRgb(h, s, Math.max(l - 0.1, 0));
              textGradient.addColorStop(0, `rgb(${lighter.r}, ${lighter.g}, ${lighter.b})`);
              textGradient.addColorStop(0.5, settings.textColor);
              textGradient.addColorStop(1, `rgb(${darker.r}, ${darker.g}, ${darker.b})`);
            } else {
              textGradient.addColorStop(0, '#ffffff');
              textGradient.addColorStop(0.5, '#ffd700');
              textGradient.addColorStop(1, '#ffffff');
            }
            
            ctx.fillStyle = textGradient;
            ctx.fillText(text, x, y);
            break;
            
          default: // modern
            // Modern text with gradient and highlight
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            const modernGradient = ctx.createLinearGradient(x, y, x + ctx.measureText(text).width, y);
            const modernBase = hexToRgb(settings.textColor);
            if (modernBase) {
              const [h, s, l] = rgbToHsl(modernBase.r, modernBase.g, modernBase.b);
              const light = hslToRgb(h, s, Math.min(l + 0.2, 1));
              const mid = hslToRgb(h, s, Math.max(l - 0.1, 0));
              const dark = hslToRgb(h, s, Math.max(l - 0.2, 0));
              modernGradient.addColorStop(0, `rgb(${light.r}, ${light.g}, ${light.b})`);
              modernGradient.addColorStop(0.7, `rgb(${mid.r}, ${mid.g}, ${mid.b})`);
              modernGradient.addColorStop(1, `rgb(${dark.r}, ${dark.g}, ${dark.b})`);
            } else {
              modernGradient.addColorStop(0, '#ffffff');
              modernGradient.addColorStop(0.7, '#f0f0f0');
              modernGradient.addColorStop(1, '#e0e0e0');
            }

            ctx.fillStyle = modernGradient;
            ctx.fillText(text, x, y);
            break;
        }
      }

      async function finishImage() {
        // Thêm hiệu ứng cuối cùng
        addFinalTouches(ctx, settings);
        
        try {
          // Tạo metadata từ thông tin location
          const locationData = {
            latitude: settings.latitude,
            longitude: settings.longitude,
            elevation: settings.elevation,
            locationName: settings.locationName,
            weatherInfo: settings.weatherInfo
          };
          
          // Tạo blob với EXIF metadata
          const blob = await createImageWithMetadata(canvas, locationData, 'image/jpeg', 0.95);
          
          if (blob) {
            const url = URL.createObjectURL(blob);
            setGeneratedImageUrl(url);
            // Lưu image data để có thể tạo các định dạng khác
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setGeneratedImageData(imageData);
            
            let message = 'Ảnh đã được tạo thành công!';
            if (settings.latitude && settings.longitude) {
              message += ' (Đã ghi thông tin vị trí vào metadata)';
            }
            toast.success(message);
          }
        } catch (error) {
          console.error('Error creating image with metadata:', error);
          // Fallback to regular blob
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setGeneratedImageUrl(url);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              setGeneratedImageData(imageData);
              toast.success('Ảnh đã được tạo thành công!');
            }
          }, 'image/jpeg', 0.95);
        }
      }

      function addFinalTouches(ctx: CanvasRenderingContext2D, settings: ImageSettings) {
        // Thêm subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, settings.width, settings.height);
        
        // Thêm subtle highlight ở góc
        const cornerHighlight = ctx.createLinearGradient(0, 0, settings.width * 0.3, settings.height * 0.3);
        cornerHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        cornerHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = cornerHighlight;
        ctx.fillRect(0, 0, settings.width * 0.3, settings.height * 0.3);
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
    downloadImage,
    downloadImageWebP,
    downloadImageJPEG,
    downloadImagePNG
  };
};
