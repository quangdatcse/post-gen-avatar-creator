// Location utility functions for getting coordinates from place names

export interface LocationInfo {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  region?: string;
}

// Free geocoding service using OpenStreetMap Nominatim
export const getLocationInfo = async (placeName: string): Promise<LocationInfo | null> => {
  if (!placeName.trim()) {
    throw new Error('Vui lòng nhập tên địa điểm');
  }

  try {
    const encodedName = encodeURIComponent(placeName.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedName}&limit=1&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Post-Gen-Avatar-Creator/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Không thể kết nối đến dịch vụ địa lý');
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Không tìm thấy thông tin cho địa điểm này');
    }

    const location = data[0];
    
    return {
      name: location.display_name,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      country: location.address?.country,
      region: location.address?.state || location.address?.region
    };
  } catch (error) {
    console.error('Error fetching location info:', error);
    throw error;
  }
};

// Get elevation data from Open-Elevation API
export const getElevation = async (latitude: number, longitude: number): Promise<number | null> => {
  try {
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Elevation service unavailable');
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return Math.round(data.results[0].elevation);
    }
    
    return null;
  } catch (error) {
    console.warn('Error fetching elevation:', error);
    return null;
  }
};

// Format coordinates for display
export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

// Popular locations with predefined coordinates
export const popularLocations = [
  { name: 'Hà Nội, Việt Nam', latitude: 21.0285, longitude: 105.8542 },
  { name: 'TP. Hồ Chí Minh, Việt Nam', latitude: 10.8231, longitude: 106.6297 },
  { name: 'Đà Nẵng, Việt Nam', latitude: 16.0471, longitude: 108.2068 },
  { name: 'Hạ Long, Quảng Ninh', latitude: 20.9101, longitude: 107.1839 },
  { name: 'Hội An, Quảng Nam', latitude: 15.8801, longitude: 108.3380 },
  { name: 'Sapa, Lào Cai', latitude: 22.3364, longitude: 103.8439 },
  { name: 'Phú Quốc, Kiên Giang', latitude: 10.2899, longitude: 103.9840 },
  { name: 'Nha Trang, Khánh Hòa', latitude: 12.2388, longitude: 109.1967 }
];
