
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign, BarChart3, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span>Smart Expense Tracking</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up" style={{animationDelay: "0.1s"}}>
            Control Your Finances with Confidence
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: "0.2s"}}>
            Track, analyze, and optimize your spending habits with our intuitive
            expense tracker. Take control of your financial future today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay: "0.3s"}}>
            <Button 
              size="lg" 
              className="w-full sm:w-auto group"
              onClick={() => navigate("/dashboard")}
            >
              Start Tracking Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate("/add")}
            >
              Add First Expense
            </Button>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: DollarSign,
              title: "Track Expenses",
              description: "Easily log and categorize your daily expenses in seconds",
              delay: "0.4s"
            },
            {
              icon: BarChart3,
              title: "Visualize Spending",
              description: "See where your money goes with intuitive charts and graphs",
              delay: "0.5s"
            },
            {
              icon: Wallet,
              title: "Manage Budget",
              description: "Set budgets and receive alerts to stay on track with your goals",
              delay: "0.6s"
            }
          ].map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 border glass card-shine animate-scale-in"
              style={{animationDelay: feature.delay}}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
