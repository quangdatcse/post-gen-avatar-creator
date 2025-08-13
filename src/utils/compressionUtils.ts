// Utility functions for image compression and format comparison

export interface CompressionResult {
  format: string;
  size: number;
  sizeMB: number;
  compressionRatio: number;
}

export const getFormatInfo = (format: 'png' | 'jpeg' | 'webp') => {
  const formatInfo = {
    png: {
      name: 'PNG',
      description: 'Không nén, chất lượng tối đa',
      extension: 'png',
      mimeType: 'image/png',
      supportsTransparency: true,
      typical: 'Phù hợp cho ảnh có văn bản, logo'
    },
    jpeg: {
      name: 'JPEG',
      description: 'Nén vừa phải, tương thích cao',
      extension: 'jpg',
      mimeType: 'image/jpeg',
      supportsTransparency: false,
      typical: 'Phù hợp cho ảnh thực tế, chia sẻ web'
    },
    webp: {
      name: 'WebP',
      description: 'Nén tốt nhất, dung lượng nhỏ',
      extension: 'webp',
      mimeType: 'image/webp',
      supportsTransparency: true,
      typical: 'Phù hợp cho web hiện đại, tiết kiệm băng thông'
    }
  };

  return formatInfo[format];
};

export const getQualityRecommendation = (format: 'jpeg' | 'webp') => {
  const recommendations = {
    jpeg: {
      high: { quality: 0.9, description: 'Chất lượng cao (90%)' },
      medium: { quality: 0.8, description: 'Cân bằng tốt (80%)' },
      low: { quality: 0.6, description: 'Nén mạnh (60%)' }
    },
    webp: {
      high: { quality: 0.85, description: 'Chất lượng cao (85%)' },
      medium: { quality: 0.75, description: 'Cân bằng tốt (75%)' },
      low: { quality: 0.5, description: 'Nén mạnh (50%)' }
    }
  };

  return recommendations[format];
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateCompressionRatio = (originalSize: number, compressedSize: number): number => {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

// Simulate file sizes for different formats (for estimation)
export const estimateFileSizes = (width: number, height: number) => {
  const pixels = width * height;
  
  // Rough estimates based on typical compression ratios
  const estimates = {
    png: pixels * 3, // RGB without compression
    jpeg_high: pixels * 0.3, // 90% quality
    jpeg_medium: pixels * 0.2, // 80% quality
    jpeg_low: pixels * 0.1, // 60% quality
    webp_high: pixels * 0.25, // 85% quality
    webp_medium: pixels * 0.15, // 75% quality
    webp_low: pixels * 0.08 // 50% quality
  };

  return estimates;
};
