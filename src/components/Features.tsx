
import React from "react";
import { 
  PieChart, 
  LineChart, 
  Clock, 
  Smartphone, 
  Layers, 
  Shield 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: PieChart,
      title: "Expense Categorization",
      description: "Automatically categorize your expenses to understand your spending habits",
    },
    {
      icon: LineChart,
      title: "Spending Analytics",
      description: "View detailed charts and trends to optimize your financial decisions",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your expenses in real-time and stay updated on your financial status",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access your expense data anytime, anywhere on any device",
    },
    {
      icon: Layers,
      title: "Data Export",
      description: "Export your expense data to CSV or PDF for further analysis",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your financial data is securely stored and protected",
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Powerful Features for Better Financial Management
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our expense tracker comes packed with all the tools you need to manage
            your finances effectively and make informed decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
