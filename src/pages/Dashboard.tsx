
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseBarChart, ExpensePieChart, ExpenseLineChart } from "@/components/Charts";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/context/ExpenseContext";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { CreditCard, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { totalExpenses, expensesByCategory, expenses, loading } = useExpenses();

  // Calculate total categories
  const totalCategories = expensesByCategory.length;

  // Calculate average expense amount
  const averageExpense = expenses.length > 0
    ? totalExpenses / expenses.length
    : 0;

  // Get highest expense category
  const highestExpenseCategory = expensesByCategory.length > 0
    ? expensesByCategory.reduce((prev, current) => {
        return prev.amount > current.amount ? prev : current;
      }, { category: "None", amount: 0 })
    : { category: "None", amount: 0 };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track and analyze your expense patterns.
          </p>
        </div>

        {loading ? (
          /* Loading Skeletons */
          <div className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28 mb-2" />
                    <Skeleton className="h-4 w-36" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <div className="grid gap-6 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Expenses Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Expenses
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    ${totalExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    From {expenses.length} transactions
                  </p>
                </CardContent>
              </Card>

              {/* Average Expense Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Average Expense
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    ${averageExpense.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Per transaction
                  </p>
                </CardContent>
              </Card>

              {/* Categories Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Categories
                  </CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {totalCategories}
                  </div>
                  <p className="text-xs text-gray-500">
                    Expense categories
                  </p>
                </CardContent>
              </Card>

              {/* Highest Expense Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Highest Category
                  </CardTitle>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    ${highestExpenseCategory.amount.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {highestExpenseCategory.category}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ExpenseBarChart />
                  <ExpensePieChart />
                  <div className="md:col-span-2 lg:col-span-1">
                    <ExpenseLineChart />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="categories" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <ExpensePieChart />
                  <ExpenseBarChart />
                </div>
              </TabsContent>
              <TabsContent value="trends" className="mt-0">
                <div className="grid gap-6">
                  <ExpenseLineChart />
                </div>
              </TabsContent>
            </Tabs>

            {/* Recent Expenses */}
            <div className="mt-6">
              <ExpenseList />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
