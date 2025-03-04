
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  // Smooth scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Scroll Indicator */}
        <div className="flex justify-center mb-16">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full animate-bounce"
            onClick={scrollToFeatures}
          >
            <ChevronDown className="h-6 w-6" />
            <span className="sr-only">Scroll down</span>
          </Button>
        </div>

        {/* Features Section */}
        <section id="features">
          <Features />
        </section>

        {/* Testimonial/CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Take Control of Your Finances?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of users who have already transformed their
                financial habits with our expense tracker.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="px-8"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900/50 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-primary font-medium">
                <span className="text-xl font-semibold">ExpenseTracker</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
