
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define expense type
export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

// Define context type
type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  totalExpenses: number;
  expensesByCategory: { category: string; amount: number }[];
  loading: boolean;
};

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Categories for sample data
const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Shopping",
  "Healthcare",
  "Travel",
  "Personal Care",
  "Education",
  "Home",
];

// Generate sample expenses
const generateSampleExpenses = () => {
  const sampleExpenses: Expense[] = [];
  
  // Create 20 sample expenses
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = Math.floor(Math.random() * 200) + 5;
    
    // Generate a random date within the last 2 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    sampleExpenses.push({
      id: `expense-${i + 1}`,
      amount,
      category,
      description: `Sample ${category} expense`,
      date: date.toISOString().split('T')[0],
    });
  }
  
  return sampleExpenses;
};

// Provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expenses from localStorage or use sample data
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      // Use sample data for first-time users
      const samples = generateSampleExpenses();
      setExpenses(samples);
      localStorage.setItem("expenses", JSON.stringify(samples));
    }
    
    // Simulate loading for a smoother experience
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Save expenses to localStorage when updated
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses, loading]);

  // Add a new expense
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: `expense-${Date.now()}`,
    };
    
    setExpenses((prev) => [newExpense, ...prev]);
    toast.success("Expense added successfully");
  };

  // Update an existing expense
  const updateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    toast.success("Expense updated successfully");
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate expenses by category
  const expensesByCategory = categories
    .map((category) => {
      const amount = expenses
        .filter((expense) => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0);
      
      return { category, amount };
    })
    .filter(item => item.amount > 0);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        totalExpenses,
        expensesByCategory,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  
  return context;
};
