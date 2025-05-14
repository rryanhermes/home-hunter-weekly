
import { Property } from "@/data/mockProperties";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="property-card overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.address}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-estate-primary">
            {property.propertyType}
          </Badge>
          <Badge className="absolute top-2 left-2 bg-estate-success">
            {property.daysOnMarket} days on market
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{property.address}</h3>
          <p className="text-gray-600 text-sm mb-2">{`${property.city}, ${property.state} ${property.zipCode}`}</p>
          
          <p className="text-xl font-bold text-estate-primary mb-3">
            {formatCurrency(property.price)}
          </p>
          
          <div className="flex justify-between text-sm mb-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{property.beds} beds</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{property.baths} baths</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <span>{property.squareFeet} sqft</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-slate-100 rounded p-2 text-center">
              <p className="text-xs text-gray-600">ROI</p>
              <p className="font-semibold text-estate-secondary">{property.roi}%</p>
            </div>
            <div className="bg-slate-100 rounded p-2 text-center">
              <p className="text-xs text-gray-600">Cash Flow</p>
              <p className="font-semibold text-estate-secondary">${property.cashFlow}/mo</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-estate-primary rounded-full"
              style={{ width: `${Math.min(property.capRate * 10, 100)}%` }}
            />
          </div>
          <div className="flex justify-between w-full mt-1 text-xs text-gray-600">
            <span>Deal Score</span>
            <span>{property.capRate}% Cap Rate</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
