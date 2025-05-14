
import Layout from "@/components/Layout";
import PreferencesForm from "@/components/PreferencesForm";
import { useToast } from "@/components/ui/use-toast";

const Preferences = () => {
  const { toast } = useToast();
  
  const handleSaved = () => {
    toast({
      title: "Preferences Saved",
      description: "Your investment preferences have been updated. We'll notify you of matching properties!",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Investment Preferences</h1>
        <p className="text-gray-600 mb-8">
          Tell us what you're looking for in an investment property, and we'll find deals that match your criteria.
        </p>
        <PreferencesForm onSaved={handleSaved} />
      </div>
    </Layout>
  );
};

export default Preferences;
