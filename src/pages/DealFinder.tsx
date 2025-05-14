
import { useState } from "react";
import Layout from "@/components/Layout";
import ApiKeySetup from "@/components/ApiKeySetup";
import { CrawlService } from "@/services/CrawlService";
import { DealAnalysisService } from "@/services/DealAnalysisService";
import { NotificationService } from "@/services/NotificationService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DiscoveredProperty {
  id: string;
  address: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  grade?: string;
  score?: number;
  capRate?: number;
  cashFlow?: number;
}

const DealFinder = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minBedrooms, setMinBedrooms] = useState(1);
  const [minBathrooms, setMinBathrooms] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredProperties, setDiscoveredProperties] = useState<DiscoveredProperty[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [email, setEmail] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState<"daily" | "weekly" | "instant">("daily");
  const [minimumGrade, setMinimumGrade] = useState<"A" | "B" | "C" | "D" | "any">("B");

  const formatPriceLabel = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const handleSearch = async () => {
    if (!location) {
      toast({
        title: "Error",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = CrawlService.getApiKey();
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please set your Firecrawl API key first",
          variant: "destructive",
        });
        setActiveTab("setup");
        setIsLoading(false);
        return;
      }

      const filters = {
        propertyType: propertyType !== "all" ? propertyType : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minBedrooms,
        minBathrooms,
      };

      const result = await CrawlService.crawlMlsListings(location, filters);
      
      if (!result.success || !result.data) {
        toast({
          title: "Error",
          description: result.error || "Failed to retrieve property listings",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Process the results and analyze each property
      const analyzedProperties = result.data.map((property: any, index: number) => {
        const metrics = DealAnalysisService.analyzeProperty(property);
        const grade = DealAnalysisService.gradeDeal(metrics);
        
        return {
          id: `property-${index}`,
          address: property.address,
          price: property.price,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          squareFeet: property.sqft || 0,
          yearBuilt: property.yearBuilt || 0,
          grade: grade.grade,
          score: grade.score,
          capRate: metrics.capRate,
          cashFlow: metrics.cashFlow,
        };
      });

      setDiscoveredProperties(analyzedProperties);
      
      toast({
        title: "Search Complete",
        description: `Found ${analyzedProperties.length} properties matching your criteria`,
      });
    } catch (error) {
      console.error("Error searching for properties:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during the search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const preferences = {
        frequency: notificationFrequency,
        minimumGrade: minimumGrade,
        locationPreferences: [location],
        propertyTypes: propertyType === "all" ? ["Single Family", "Multi Family", "Condo", "Townhouse"] : [propertyType],
        priceRange: priceRange,
        minBedrooms: minBedrooms,
        minBathrooms: minBathrooms,
      };

      const success = await NotificationService.subscribeToAlerts(email, preferences);
      
      if (success) {
        toast({
          title: "Subscription Successful",
          description: `You will receive ${notificationFrequency} alerts for new properties that match your criteria`,
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: "Unable to subscribe. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error subscribing to alerts:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A': return "bg-green-500";
      case 'B': return "bg-blue-500";
      case 'C': return "bg-yellow-500";
      case 'D': return "bg-orange-500";
      case 'F': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Deal Finder</h1>
        <p className="text-gray-600 mb-8">
          Find the best real estate investment opportunities with our AI-powered deal analyzer.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Deals</TabsTrigger>
            <TabsTrigger value="alerts">Email Alerts</TabsTrigger>
            <TabsTrigger value="setup">API Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Search Criteria</CardTitle>
                <CardDescription>
                  Enter your investment criteria to find matching properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      type="text"
                      placeholder="City, State, or ZIP Code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium mb-1">Property Type</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Property Types</SelectItem>
                        <SelectItem value="Single Family">Single Family</SelectItem>
                        <SelectItem value="Multi Family">Multi-Family</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Min Bedrooms</label>
                    <Select
                      value={minBedrooms.toString()}
                      onValueChange={(val) => setMinBedrooms(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Beds" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Min Bathrooms</label>
                    <Select
                      value={minBathrooms.toString()}
                      onValueChange={(val) => setMinBathrooms(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Baths" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-12">
                    <label className="block text-sm font-medium mb-1">Price Range</label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={2000000}
                        step={50000}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{formatPriceLabel(priceRange[0])}</span>
                      <span>{formatPriceLabel(priceRange[1])}</span>
                    </div>
                  </div>

                  <div className="md:col-span-12">
                    <Button 
                      onClick={handleSearch} 
                      disabled={isLoading}
                      className="w-full bg-estate-primary hover:bg-estate-secondary"
                    >
                      {isLoading ? "Searching..." : "Find Investment Opportunities"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {discoveredProperties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Discovered Properties</CardTitle>
                  <CardDescription>
                    Properties are graded based on investment potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Cap Rate</TableHead>
                        <TableHead>Monthly Cash Flow</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discoveredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <Badge className={getGradeBadgeColor(property.grade || 'N/A')}>
                              {property.grade || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.address}</TableCell>
                          <TableCell>${property.price.toLocaleString()}</TableCell>
                          <TableCell>{property.propertyType}</TableCell>
                          <TableCell>{property.capRate?.toFixed(1)}%</TableCell>
                          <TableCell>
                            <span className={property.cashFlow && property.cashFlow >= 0 ? "text-green-600" : "text-red-600"}>
                              ${Math.round(property.cashFlow ? property.cashFlow / 12 : 0).toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Alerts</CardTitle>
                <CardDescription>
                  Get notified when new properties matching your criteria become available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <Select 
                      value={notificationFrequency} 
                      onValueChange={(val) => setNotificationFrequency(val as "daily" | "weekly" | "instant")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="instant">Instant Alerts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Deal Grade</label>
                    <Select 
                      value={minimumGrade} 
                      onValueChange={(val) => setMinimumGrade(val as "A" | "B" | "C" | "D" | "any")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select minimum grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A Grade Only</SelectItem>
                        <SelectItem value="B">B Grade or Better</SelectItem>
                        <SelectItem value="C">C Grade or Better</SelectItem>
                        <SelectItem value="D">D Grade or Better</SelectItem>
                        <SelectItem value="any">Any Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSubscribe} 
                    disabled={isLoading}
                    className="w-full bg-estate-primary hover:bg-estate-secondary"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe to Alerts"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <ApiKeySetup />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DealFinder;
