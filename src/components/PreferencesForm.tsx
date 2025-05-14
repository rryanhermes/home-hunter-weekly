import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface InvestmentPreference {
  minPrice: number;
  maxPrice: number;
  minRoi: number;
  minCashFlow: number;
  minCapRate: number;
  propertyTypes: string[];
  locations: string[];
  bedrooms: number;
  bathrooms: number;
  notificationFrequency: "daily" | "weekly";
  emailNotifications: boolean;
  email: string;
}

const defaultPreferences: InvestmentPreference = {
  minPrice: 200000,
  maxPrice: 500000,
  minRoi: 5,
  minCashFlow: 500,
  minCapRate: 4,
  propertyTypes: ["Single Family"],
  locations: ["Austin, TX"],
  bedrooms: 3,
  bathrooms: 2,
  notificationFrequency: "daily",
  emailNotifications: true,
  email: "",
};

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState<InvestmentPreference>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Preferences Saved",
        description: "Your investment preferences have been updated. We'll notify you of matching properties!",
      });
      setLoading(false);
    }, 1000);
  };

  const handlePriceChange = (values: number[]) => {
    setPreferences({
      ...preferences,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would be a proper location selector with geocoding
    setPreferences({
      ...preferences,
      locations: [e.target.value],
    });
  };

  const handlePropertyTypeChange = (value: string) => {
    setPreferences({
      ...preferences,
      propertyTypes: [value],
    });
  };

  const addLocation = () => {
    // This is a simplified version, in a real app you'd have a proper location picker
    const locationInput = document.getElementById("location-input") as HTMLInputElement;
    if (locationInput && locationInput.value && !preferences.locations.includes(locationInput.value)) {
      setPreferences({
        ...preferences,
        locations: [...preferences.locations, locationInput.value],
      });
      locationInput.value = "";
    }
  };

  const removeLocation = (location: string) => {
    setPreferences({
      ...preferences,
      locations: preferences.locations.filter((loc) => loc !== location),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Tabs defaultValue="investment">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investment">Investment Criteria</TabsTrigger>
          <TabsTrigger value="property">Property Details</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Parameters</CardTitle>
              <CardDescription>Set your financial criteria for potential investments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Price Range</Label>
                  <div className="text-sm text-gray-500">
                    ${preferences.minPrice.toLocaleString()} - ${preferences.maxPrice.toLocaleString()}
                  </div>
                </div>
                <Slider
                  defaultValue={[preferences.minPrice, preferences.maxPrice]}
                  max={1000000}
                  min={50000}
                  step={10000}
                  onValueChange={handlePriceChange}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Minimum ROI</Label>
                  <div className="text-sm text-gray-500">{preferences.minRoi}%</div>
                </div>
                <Slider
                  defaultValue={[preferences.minRoi]}
                  max={20}
                  min={1}
                  step={0.5}
                  onValueChange={([value]) => setPreferences({...preferences, minRoi: value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Minimum Monthly Cash Flow</Label>
                  <div className="text-sm text-gray-500">${preferences.minCashFlow}</div>
                </div>
                <Slider
                  defaultValue={[preferences.minCashFlow]}
                  max={2000}
                  min={0}
                  step={50}
                  onValueChange={([value]) => setPreferences({...preferences, minCashFlow: value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Minimum Cap Rate</Label>
                  <div className="text-sm text-gray-500">{preferences.minCapRate}%</div>
                </div>
                <Slider
                  defaultValue={[preferences.minCapRate]}
                  max={15}
                  min={1}
                  step={0.5}
                  onValueChange={([value]) => setPreferences({...preferences, minCapRate: value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Specifics</CardTitle>
              <CardDescription>Define what kind of properties you're looking for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select 
                  value={preferences.propertyTypes[0]} 
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Family">Single Family</SelectItem>
                    <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Locations</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {preferences.locations.map((location) => (
                    <Badge key={location} className="bg-estate-primary flex items-center gap-1">
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="ml-1 rounded-full hover:bg-estate-secondary p-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    id="location-input"
                    placeholder="City, State"
                    defaultValue=""
                    className="flex-1"
                  />
                  <Button type="button" onClick={addLocation} className="ml-2 bg-estate-primary">
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Minimum Bedrooms</Label>
                  <Select 
                    value={preferences.bedrooms.toString()} 
                    onValueChange={(value) => setPreferences({...preferences, bedrooms: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}+ Bedrooms</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Minimum Bathrooms</Label>
                  <Select 
                    value={preferences.bathrooms.toString()} 
                    onValueChange={(value) => setPreferences({...preferences, bathrooms: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}+ Bathrooms</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about new matching properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                />
              </div>
              
              {preferences.emailNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={preferences.email}
                    onChange={(e) => setPreferences({...preferences, email: e.target.value})}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select 
                  value={preferences.notificationFrequency} 
                  onValueChange={(value: "daily" | "weekly") => setPreferences({...preferences, notificationFrequency: value})}
                  disabled={!preferences.emailNotifications}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                We'll only send you notifications about properties that match your investment criteria.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full bg-estate-primary hover:bg-estate-secondary" disabled={loading}>
        {loading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
};

export default PreferencesForm;
