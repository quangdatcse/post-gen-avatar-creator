
export const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const loadImageFromUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    
    img.crossOrigin = 'anonymous';
    
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout: Image took too long to load'));
    }, 15000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      } catch (error) {
        reject(new Error(`Canvas error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Failed to load image - may be blocked by CORS policy'));
    };

    try {
      img.src = url;
    } catch (error) {
      clearTimeout(timeoutId);
      reject(new Error(`Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
};
