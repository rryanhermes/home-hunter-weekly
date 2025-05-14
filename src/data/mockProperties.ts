
export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  squareFeet: number;
  imageUrl: string;
  propertyType: string;
  yearBuilt: number;
  lotSize: number;
  daysOnMarket: number;
  roi: number;
  cashFlow: number;
  capRate: number;
  rentEstimate: number;
}

export const mockProperties: Property[] = [
  {
    id: "prop-001",
    address: "123 Investor Lane",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    price: 450000,
    beds: 3,
    baths: 2,
    squareFeet: 1800,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
    propertyType: "Single Family",
    yearBuilt: 2018,
    lotSize: 0.25,
    daysOnMarket: 7,
    roi: 7.2,
    cashFlow: 650,
    capRate: 5.8,
    rentEstimate: 2800
  },
  {
    id: "prop-002",
    address: "456 Cash Flow Drive",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    price: 375000,
    beds: 4,
    baths: 2.5,
    squareFeet: 2100,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80",
    propertyType: "Single Family",
    yearBuilt: 2015,
    lotSize: 0.2,
    daysOnMarket: 14,
    roi: 8.5,
    cashFlow: 850,
    capRate: 6.2,
    rentEstimate: 2400
  },
  {
    id: "prop-003",
    address: "789 ROI Avenue",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    price: 325000,
    beds: 3,
    baths: 2,
    squareFeet: 1650,
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80",
    propertyType: "Townhouse",
    yearBuilt: 2019,
    lotSize: 0.1,
    daysOnMarket: 5,
    roi: 9.1,
    cashFlow: 780,
    capRate: 7.1,
    rentEstimate: 2200
  },
  {
    id: "prop-004",
    address: "1010 Equity Street",
    city: "San Antonio",
    state: "TX",
    zipCode: "78205",
    price: 280000,
    beds: 2,
    baths: 2,
    squareFeet: 1200,
    imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80",
    propertyType: "Condo",
    yearBuilt: 2017,
    lotSize: 0,
    daysOnMarket: 21,
    roi: 6.8,
    cashFlow: 600,
    capRate: 5.5,
    rentEstimate: 1900
  },
  {
    id: "prop-005",
    address: "555 Appreciation Circle",
    city: "Fort Worth",
    state: "TX",
    zipCode: "76102",
    price: 520000,
    beds: 5,
    baths: 3,
    squareFeet: 2800,
    imageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80",
    propertyType: "Single Family",
    yearBuilt: 2020,
    lotSize: 0.3,
    daysOnMarket: 10,
    roi: 6.5,
    cashFlow: 550,
    capRate: 5.2,
    rentEstimate: 3200
  },
  {
    id: "prop-006",
    address: "222 Rental Court",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    price: 410000,
    beds: 3,
    baths: 2.5,
    squareFeet: 1950,
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80",
    propertyType: "Duplex",
    yearBuilt: 2015,
    lotSize: 0.15,
    daysOnMarket: 18,
    roi: 8.9,
    cashFlow: 1200,
    capRate: 7.8,
    rentEstimate: 3600
  }
];
