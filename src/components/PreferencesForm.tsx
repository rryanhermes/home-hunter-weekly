
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotificationService, NotificationPreferences } from "@/services/NotificationService";
import { Mail, SliderHorizontal, Settings } from "lucide-react";

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
  notificationFrequency: "daily" | "weekly" | "instant";
  emailNotifications: boolean;
  email: string;
  minimumGrade: "A" | "B" | "C" | "D" | "any";
}

interface PreferencesFormProps {
  onSaved?: () => void;
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
  minimumGrade: "B"
};

const PreferencesForm = ({ onSaved }: PreferencesFormProps) => {
  const [preferences, setPreferences] = useState<InvestmentPreference>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("notification");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (preferences.emailNotifications && preferences.email) {
        const notificationPrefs: NotificationPreferences = {
          frequency: preferences.notificationFrequency,
          minimumGrade: preferences.minimumGrade,
          locationPreferences: preferences.locations,
          propertyTypes: preferences.propertyTypes,
          priceRange: [preferences.minPrice, preferences.maxPrice] as [number, number],
          minBedrooms: preferences.bedrooms,
          minBathrooms: preferences.bathrooms,
        };
        
        await NotificationService.subscribeToAlerts(preferences.email, notificationPrefs);
      }
      
      if (onSaved) {
        onSaved();
      } else {
        toast({
          title: "Preferences Saved",
          description: "Your investment preferences have been updated. We'll notify you of matching properties!",
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const handleTestNotification = async () => {
    if (!preferences.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await NotificationService.testEmailNotification(preferences.email);
      if (result) {
        toast({
          title: "Test Email Sent",
          description: `A test notification has been sent to ${preferences.email}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send test email. Please check your email address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notification" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center gap-2">
            <SliderHorizontal className="h-4 w-4" />
            <span>Investment Criteria</span>
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Property Details</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about new matching properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">Receive alerts about new investment opportunities</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                />
              </div>
              
              {preferences.emailNotifications && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={preferences.email}
                      onChange={(e) => setPreferences({...preferences, email: e.target.value})}
                      required
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base">Notification Frequency</Label>
                    <RadioGroup 
                      value={preferences.notificationFrequency}
                      onValueChange={(value: "daily" | "weekly" | "instant") => 
                        setPreferences({...preferences, notificationFrequency: value})
                      }
                      className="grid grid-cols-1 gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                        <RadioGroupItem value="instant" id="instant" />
                        <Label htmlFor="instant" className="flex-1 cursor-pointer font-normal">
                          <div className="font-medium">Instant Alerts</div>
                          <div className="text-sm text-muted-foreground">
                            Get notified immediately when we find matching deals
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily" className="flex-1 cursor-pointer font-normal">
                          <div className="font-medium">Daily Digest</div>
                          <div className="text-sm text-muted-foreground">
                            Receive a summary of new properties once a day
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly" className="flex-1 cursor-pointer font-normal">
                          <div className="font-medium">Weekly Summary</div>
                          <div className="text-sm text-muted-foreground">
                            Get a roundup of the best deals once a week
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base">Deal Quality Threshold</Label>
                    <p className="text-sm text-muted-foreground">Only notify me about properties graded:</p>
                    <Select 
                      value={preferences.minimumGrade}
                      onValueChange={(value: "A" | "B" | "C" | "D" | "any") => 
                        setPreferences({...preferences, minimumGrade: value})
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select minimum grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A Grade Only (Best Deals)</SelectItem>
                        <SelectItem value="B">B Grade or Better</SelectItem>
                        <SelectItem value="C">C Grade or Better</SelectItem>
                        <SelectItem value="D">D Grade or Better</SelectItem>
                        <SelectItem value="any">Any Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="button" 
                      onClick={handleTestNotification} 
                      variant="outline"
                      disabled={loading || !preferences.email}
                      className="w-full"
                    >
                      Send Test Notification
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                We'll only send you notifications about properties that match your investment criteria.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
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
      </Tabs>
      
      <Button type="submit" className="w-full bg-estate-primary hover:bg-estate-secondary" disabled={loading}>
        {loading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
};

export default PreferencesForm;
