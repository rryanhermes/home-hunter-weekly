
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CrawlService } from "@/services/CrawlService";

const ApiKeySetup = () => {
  const [firecrawlKey, setFirecrawlKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  // Check if key already exists
  useState(() => {
    const existingKey = CrawlService.getApiKey();
    if (existingKey) {
      setFirecrawlKey(existingKey);
      setIsVerified(true);
    }
  });

  const handleVerifyKey = async () => {
    if (!firecrawlKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await CrawlService.testApiKey(firecrawlKey);
      
      if (isValid) {
        CrawlService.saveApiKey(firecrawlKey);
        setIsVerified(true);
        toast({
          title: "Success",
          description: "API key verified and saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Enter your API keys to enable data crawling and analysis features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="firecrawl-key" className="text-sm font-medium">
            Firecrawl API Key {isVerified && <span className="text-green-500 ml-2">(Verified)</span>}
          </label>
          <div className="flex space-x-2">
            <Input
              id="firecrawl-key"
              type="password"
              value={firecrawlKey}
              onChange={(e) => setFirecrawlKey(e.target.value)}
              placeholder="Enter your Firecrawl API key"
              className="flex-1"
            />
            <Button 
              onClick={handleVerifyKey}
              disabled={isLoading || (isVerified && !!firecrawlKey)}
            >
              {isLoading ? "Verifying..." : isVerified ? "Verified" : "Verify"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isVerified 
              ? "Your API key is valid and ready to use" 
              : "Required for crawling MLS listings and property data"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          API keys are stored securely in your browser's local storage.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySetup;
