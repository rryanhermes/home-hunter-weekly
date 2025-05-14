
export const API_ENDPOINTS = {
  // Firecrawl for web scraping
  FIRECRAWL: {
    BASE_URL: 'https://api.firecrawl.dev',
    EXTRACT_ENDPOINT: '/api/extract',
  },
  
  // Economic data (unemployment rate, interest rates, etc.)
  ECONOMIC_DATA: {
    FRED: 'https://api.stlouisfed.org/fred/series/observations',
    CENSUS: 'https://api.census.gov/data',
  },
  
  // Real estate APIs
  REAL_ESTATE: {
    ZILLOW: 'https://www.zillow.com/api',
    REDFIN: 'https://www.redfin.com/stingray/api',
    REALTOR: 'https://api.realtor.com',
  },
  
  // Geocoding and location data
  LOCATION: {
    GOOGLE_MAPS: 'https://maps.googleapis.com/maps/api',
    MAPBOX: 'https://api.mapbox.com',
  },
};

export const API_KEYS = {
  // These would normally be stored in environment variables or a secure storage solution
  getFirecrawlKey: () => localStorage.getItem('firecrawl_api_key') || '',
  getGoogleMapsKey: () => localStorage.getItem('google_maps_api_key') || '',
};

export const DATA_REFRESH_INTERVALS = {
  PROPERTY_LISTINGS: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  ECONOMIC_DATA: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};
