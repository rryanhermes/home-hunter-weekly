
import { useState } from "react";
import Layout from "@/components/Layout";
import { mockProperties } from "@/data/mockProperties";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState("price");
  
  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.zipCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    return matchesSearch && matchesPrice;
  });
  
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "roi":
        return b.roi - a.roi;
      case "cashflow":
        return b.cashFlow - a.cashFlow;
      default:
        return a.price - b.price;
    }
  });
  
  const formatPriceLabel = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Available Properties</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="roi">Best ROI</SelectItem>
                <SelectItem value="cashflow">Best Cash Flow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                type="text"
                placeholder="Search by location, address, or zip code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000000}
                  step={25000}
                  onValueChange={setPriceRange}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{formatPriceLabel(priceRange[0])}</span>
                <span>{formatPriceLabel(priceRange[1])}</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Button className="w-full bg-estate-primary hover:bg-estate-secondary">
                Filter Results
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          
          {sortedProperties.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Properties;
