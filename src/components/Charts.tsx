
import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Colors for charts
const COLORS = [
  "#4f46e5", "#0ea5e9", "#06b6d4", "#0891b2", "#0e7490",
  "#0369a1", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd",
];

// Map month number to name
const getMonthName = (monthNumber: number) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthNumber];
};

export const ExpensePieChart = () => {
  const { expensesByCategory } = useExpenses();
  
  // Filter out categories with zero expenses
  const data = expensesByCategory.filter(item => item.amount > 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value}`, "Amount"]}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const ExpenseBarChart = () => {
  const { expenses } = useExpenses();
  
  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array for Recharts
  const data = Object.keys(categoryTotals)
    .map(category => ({
      category,
      amount: categoryTotals[category],
    }))
    .sort((a, b) => b.amount - a.amount) // Sort by amount descending
    .slice(0, 6); // Show top 6 categories

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="category" 
                tickFormatter={(value) => value.split(' ')[0]} 
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, "Amount"]}
              />
              <Bar 
                dataKey="amount" 
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const ExpenseLineChart = () => {
  const { expenses } = useExpenses();
  
  // Group expenses by month
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: `${getMonthName(date.getMonth())} ${date.getFullYear()}`,
        amount: 0,
        // Store month number for sorting
        monthNumber: date.getMonth(),
        year: date.getFullYear(),
      };
    }
    
    acc[monthYear].amount += expense.amount;
    return acc;
  }, {} as Record<string, { month: string; amount: number; monthNumber: number; year: number }>);
  
  // Convert to array and sort by date
  const data = Object.values(monthlyData)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNumber - b.monthNumber;
    });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
