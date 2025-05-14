
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">DealFinder</h3>
            <p className="mb-4">
              We help real estate investors find the best deals that match their investment criteria through smart MLS scanning and personalized alerts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-estate-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/preferences" className="hover:text-estate-accent transition-colors">My Preferences</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-estate-accent transition-colors">Properties</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-estate-accent"
              />
              <button
                type="submit"
                className="w-full bg-estate-primary hover:bg-estate-secondary text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p>&copy; {year} DealFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
