// EXIF metadata utility for embedding location information into images

interface ExifLocationData {
  latitude?: string;
  longitude?: string;
  elevation?: string;
  locationName?: string;
  weatherInfo?: string;
}

// Convert decimal degrees to DMS (Degrees, Minutes, Seconds) format for EXIF
export const decimalToDMS = (decimal: number): { degrees: number; minutes: number; seconds: number } => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  return { degrees, minutes, seconds };
};

// Convert canvas to blob with EXIF metadata
export const addExifMetadata = async (
  canvas: HTMLCanvasElement, 
  locationData: ExifLocationData,
  format: string = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> => {
  
  // Get the base image data
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, format, quality);
  });

  // For JPEG, we can add EXIF data
  if (format === 'image/jpeg' && (locationData.latitude || locationData.longitude)) {
    try {
      return await addExifToJpeg(blob, locationData);
    } catch (error) {
      console.warn('Failed to add EXIF data:', error);
      return blob;
    }
  }

  return blob;
};

// Add EXIF data to JPEG blob using a simplified approach
const addExifToJpeg = async (blob: Blob, locationData: ExifLocationData): Promise<Blob> => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Create EXIF data block
  const exifData = createExifData(locationData);
  
  // Find SOI (Start of Image) marker
  if (uint8Array[0] !== 0xFF || uint8Array[1] !== 0xD8) {
    throw new Error('Invalid JPEG format');
  }
  
  // Find where to insert EXIF (after SOI, before other segments)
  let insertPosition = 2;
  
  // Create new array with EXIF data inserted
  const newSize = uint8Array.length + exifData.length;
  const newArray = new Uint8Array(newSize);
  
  // Copy SOI
  newArray.set(uint8Array.slice(0, insertPosition), 0);
  
  // Insert EXIF data
  newArray.set(exifData, insertPosition);
  
  // Copy rest of image
  newArray.set(uint8Array.slice(insertPosition), insertPosition + exifData.length);
  
  return new Blob([newArray], { type: 'image/jpeg' });
};

// Create EXIF data block with GPS information
const createExifData = (locationData: ExifLocationData): Uint8Array => {
  // This is a simplified EXIF creator - in production you'd want a proper EXIF library
  const exifArray: number[] = [];
  
  // APP1 marker
  exifArray.push(0xFF, 0xE1);
  
  // Length placeholder (will be filled later)
  const lengthPos = exifArray.length;
  exifArray.push(0x00, 0x00);
  
  // EXIF identifier
  exifArray.push(...Array.from(new TextEncoder().encode('Exif\0\0')));
  
  // TIFF header
  exifArray.push(0x4D, 0x4D); // Big endian
  exifArray.push(0x00, 0x2A); // TIFF magic number
  exifArray.push(0x00, 0x00, 0x00, 0x08); // Offset to IFD
  
  // IFD0 entries count
  let entryCount = 0;
  const entriesStart = exifArray.length;
  exifArray.push(0x00, 0x00); // Placeholder for count
  
  // Add GPS info if available
  if (locationData.latitude && locationData.longitude) {
    const lat = parseFloat(locationData.latitude);
    const lng = parseFloat(locationData.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      // GPS tag
      exifArray.push(0x88, 0x25); // GPS Info tag
      exifArray.push(0x00, 0x04); // LONG type
      exifArray.push(0x00, 0x00, 0x00, 0x01); // Count
      exifArray.push(0x00, 0x00, 0x00, 0x1A); // Offset to GPS data
      entryCount++;
    }
  }
  
  // Add description with location name if available
  if (locationData.locationName) {
    // Image description tag
    exifArray.push(0x01, 0x0E); // ImageDescription tag
    exifArray.push(0x00, 0x02); // ASCII type
    const description = locationData.locationName.slice(0, 100); // Limit length
    exifArray.push(...writeUint32BE(description.length + 1));
    exifArray.push(...writeUint32BE(exifArray.length + 8)); // Offset
    entryCount++;
  }
  
  // Update entry count
  exifArray[entriesStart] = (entryCount >> 8) & 0xFF;
  exifArray[entriesStart + 1] = entryCount & 0xFF;
  
  // Next IFD offset (0 = no next IFD)
  exifArray.push(0x00, 0x00, 0x00, 0x00);
  
  // Add description string if present
  if (locationData.locationName) {
    exifArray.push(...Array.from(new TextEncoder().encode(locationData.locationName + '\0')));
  }
  
  // Update APP1 length
  const totalLength = exifArray.length - 2; // Excluding marker
  exifArray[lengthPos] = (totalLength >> 8) & 0xFF;
  exifArray[lengthPos + 1] = totalLength & 0xFF;
  
  return new Uint8Array(exifArray);
};

// Helper function to write 32-bit big-endian integer
const writeUint32BE = (value: number): number[] => {
  return [
    (value >> 24) & 0xFF,
    (value >> 16) & 0xFF,
    (value >> 8) & 0xFF,
    value & 0xFF
  ];
};

// Create image with embedded location metadata
export const createImageWithMetadata = async (
  canvas: HTMLCanvasElement,
  locationData: ExifLocationData,
  format: string = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> => {
  
  // For formats that support EXIF (mainly JPEG)
  if (format === 'image/jpeg') {
    return addExifMetadata(canvas, locationData, format, quality);
  }
  
  // For other formats, just return the regular blob
  // PNG doesn't support EXIF but supports other metadata formats
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, format, quality);
  });
};

// Extract EXIF data from image file (for debugging/verification)
export const extractExifData = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Simple EXIF extraction for verification
        // In production, use a proper EXIF library like exif-js
        const exifInfo: any = {};
        
        // Look for APP1 segment with EXIF
        for (let i = 0; i < uint8Array.length - 10; i++) {
          if (uint8Array[i] === 0xFF && uint8Array[i + 1] === 0xE1) {
            const length = (uint8Array[i + 2] << 8) | uint8Array[i + 3];
            const exifId = new TextDecoder().decode(uint8Array.slice(i + 4, i + 10));
            
            if (exifId === 'Exif\0\0') {
              exifInfo.hasExif = true;
              exifInfo.exifLength = length;
              break;
            }
          }
        }
        
        resolve(exifInfo);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
