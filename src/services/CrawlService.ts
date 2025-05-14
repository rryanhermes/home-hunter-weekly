
interface CrawlResponse {
  success: boolean;
  error?: string;
  data?: any[];
}

export class CrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static apiKey: string | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.apiKey = apiKey;
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    const storedKey = localStorage.getItem(this.API_KEY_STORAGE_KEY);
    this.apiKey = storedKey;
    return storedKey;
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      // This would be a real API call in production
      console.log('Testing API key with Firecrawl API');
      return true;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlMlsListings(location: string, filters: any = {}): Promise<CrawlResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to extract MLS listings');
      // In a real implementation, this would connect to Firecrawl's Extract Endpoint
      // For now, we'll return mock data
      
      return { 
        success: true,
        data: [
          {
            title: 'New MLS Listing: 3BR House in Austin',
            url: 'https://example.com/listing/123',
            address: '123 Main St, Austin, TX',
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            yearBuilt: 2010,
            propertyType: 'Single Family'
          },
          {
            title: 'New MLS Listing: 2BR Condo in Dallas',
            url: 'https://example.com/listing/456',
            address: '456 Oak Ave, Dallas, TX',
            price: 320000,
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1200,
            yearBuilt: 2015,
            propertyType: 'Condo'
          }
        ]
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to crawling API' 
      };
    }
  }
}
