
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { mockProperties } from "@/data/mockProperties";
import PropertyCard from "@/components/PropertyCard";

const Index = () => {
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-20">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn">
              Find Your Next <span className="text-estate-primary">Real Estate</span> Investment
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-slideIn">
              Let our AI-powered screener find the best properties that meet your investment criteria.
              Get daily updates on new deals matching your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-estate-primary hover:bg-estate-secondary text-white">
                <Link to="/preferences">Set Your Preferences</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-estate-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-estate-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Criteria</h3>
              <p className="text-gray-600">
                Tell us what you're looking for in an investment property – location, price range, ROI, and more.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-estate-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-estate-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart MLS Scanning</h3>
              <p className="text-gray-600">
                Our AI scans thousands of MLS listings daily to find properties that match your investment criteria.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="bg-estate-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-estate-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Alerts</h3>
              <p className="text-gray-600">
                Receive daily or weekly email alerts with the best matching properties – be the first to know about new deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured properties section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Button asChild variant="outline" className="border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white">
              <Link to="/properties">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-estate-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Investment?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Set your investment criteria and start receiving personalized property alerts today.
          </p>
          <Button asChild size="lg" className="bg-white text-estate-primary hover:bg-gray-100">
            <Link to="/preferences">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
