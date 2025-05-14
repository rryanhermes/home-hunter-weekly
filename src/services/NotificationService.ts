
export interface NotificationPreferences {
  frequency: 'daily' | 'weekly' | 'instant';
  minimumGrade: 'A' | 'B' | 'C' | 'D' | 'any';
  locationPreferences: string[];
  propertyTypes: string[];
  priceRange: [number, number];
  minBedrooms: number;
  minBathrooms: number;
}

export class NotificationService {
  static async subscribeToAlerts(email: string, preferences: NotificationPreferences): Promise<boolean> {
    try {
      console.log('Subscribing to alerts:', email, preferences);
      
      // Ensure priceRange is valid
      const validPreferences = {
        ...preferences,
        priceRange: Array.isArray(preferences.priceRange) && preferences.priceRange.length === 2
          ? preferences.priceRange as [number, number]
          : [0, 1000000] as [number, number]
      };
      
      // In a real implementation, this would send the data to a backend server
      // For now, we'll store in localStorage
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '{}');
      subscriptions[email] = {
        preferences: validPreferences,
        createdAt: new Date().toISOString(),
        active: true
      };
      
      localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions));
      return true;
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      return false;
    }
  }
  
  static async unsubscribe(email: string): Promise<boolean> {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '{}');
      if (subscriptions[email]) {
        subscriptions[email].active = false;
        localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions));
      }
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }
  
  static async updatePreferences(email: string, preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '{}');
      if (subscriptions[email]) {
        subscriptions[email].preferences = {
          ...subscriptions[email].preferences,
          ...preferences
        };
        localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }
  
  static async testEmailNotification(email: string): Promise<boolean> {
    // This would normally connect to an email service like SendGrid or Mailgun
    console.log(`Sending test email to ${email}`);
    return true;
  }
}
