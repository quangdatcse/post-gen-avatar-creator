
export interface ImageSettings {
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string; // Color for text
  logoFile: File | null;
  logoUrl: string;
  backgroundImageFile: File | null;
  backgroundImageUrl: string;
  backgroundUrlInput: string;
  // Frame settings
  frameFile: File | null;
  frameUrl: string;
  // Toggle features
  showTitle: boolean;
  showLogo: boolean;
  // Location info settings
  showLocationInfo: boolean;
  locationName: string;
  latitude: string;
  longitude: string;
  elevation: string;
  weatherInfo: string;
  // New design settings
  designStyle: 'modern' | 'classic' | 'minimal' | 'gradient';
  textPosition: 'bottom' | 'center' | 'top';
  logoPosition: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  // New size controls
  logoSize: number; // 10-100 (percentage)
  fontSize: number; // 20-120 (pixel size multiplier)
  // Phone number settings
  phoneNumber: string;
  showPhoneNumber: boolean;
  phoneFontSize: number; // 10-80 (pixel size multiplier)
  // Overlay settings
  enableOverlay: boolean; // Toggle overlay on/off
}
