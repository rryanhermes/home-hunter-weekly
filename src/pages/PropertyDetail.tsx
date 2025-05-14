
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { mockProperties } from "@/data/mockProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const property = mockProperties.find((p) => p.id === id);
  
  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you are looking for does not exist.</p>
          <Button asChild className="bg-estate-primary hover:bg-estate-secondary">
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleContactAgent = () => {
    toast({
      title: "Contact Request Sent",
      description: "A real estate agent will contact you shortly about this property.",
    });
  };
  
  const handleSaveProperty = () => {
    toast({
      title: "Property Saved",
      description: "This property has been added to your saved properties.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/properties" className="text-estate-primary hover:underline flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
          <p className="text-xl text-gray-600">{`${property.city}, ${property.state} ${property.zipCode}`}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={property.imageUrl} 
                alt={property.address}
                className="w-full h-[400px] object-cover"
              />
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-estate-primary">{property.propertyType}</Badge>
                  <Badge variant="outline" className="border-estate-primary text-estate-primary">
                    {property.daysOnMarket} days on market
                  </Badge>
                  <Badge variant="outline" className="border-estate-success text-estate-success">
                    {property.yearBuilt} built
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{formatCurrency(property.price)}</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-xl font-semibold">{property.beds}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-xl font-semibold">{property.baths}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500">Square Feet</p>
                    <p className="text-xl font-semibold">{property.squareFeet.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">{property.yearBuilt}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Square Feet</span>
                      <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Lot Size</span>
                      <span className="font-medium">{property.lotSize} acres</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Days on Market</span>
                      <span className="font-medium">{property.daysOnMarket}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Price per Sq Ft</span>
                      <span className="font-medium">${Math.round(property.price / property.squareFeet)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Property Description</h3>
                  <p className="text-gray-700 mb-4">
                    This beautiful {property.propertyType.toLowerCase()} property offers {property.beds} bedrooms and {property.baths} bathrooms
                    with a total of {property.squareFeet.toLocaleString()} square feet of living space. Built in {property.yearBuilt}, 
                    it features modern amenities and is located in the desirable area of {property.city}, {property.state}.
                  </p>
                  <p className="text-gray-700">
                    The property is situated on a {property.lotSize}-acre lot with ample outdoor space.
                    It has been on the market for {property.daysOnMarket} days and represents an excellent
                    investment opportunity with strong rental potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-semibold mb-4">Investment Analysis</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ROI</span>
                  <span className="font-medium text-estate-primary">{property.roi}%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Monthly Cash Flow</span>
                  <span className="font-medium text-estate-primary">${property.cashFlow}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Cap Rate</span>
                  <span className="font-medium text-estate-primary">{property.capRate}%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Monthly Rent Estimate</span>
                  <span className="font-medium text-estate-primary">${property.rentEstimate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Annual Gross Income</span>
                  <span className="font-medium text-estate-primary">${property.rentEstimate * 12}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleContactAgent} className="w-full bg-estate-primary hover:bg-estate-secondary">
                  Contact Agent
                </Button>
                
                <Button onClick={handleSaveProperty} variant="outline" className="w-full border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white">
                  Save Property
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-estate-primary/10 rounded-lg">
                <h4 className="font-semibold text-estate-secondary mb-2">Investment Highlights</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-estate-success mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Strong rental market in this area</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-estate-success mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Property value appreciation potential</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-estate-success mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Low vacancy rates in neighborhood</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
