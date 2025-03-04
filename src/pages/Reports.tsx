
import React, { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseBarChart, ExpensePieChart, ExpenseLineChart } from "@/components/Charts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Download, 
  ArrowLeft, 
  ArrowRight 
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Reports = () => {
  const { expenses, expensesByCategory, totalExpenses } = useExpenses();
  const [timeRange, setTimeRange] = useState("last30days");
  const [month, setMonth] = useState(new Date());

  // Get current date
  const currentDate = new Date();

  // Calculate date ranges based on selected timeRange
  const getDateRange = () => {
    switch (timeRange) {
      case "last7days":
        return {
          start: subMonths(currentDate, 0.25),
          end: currentDate,
          label: "Last 7 Days",
        };
      case "last30days":
        return {
          start: subMonths(currentDate, 1),
          end: currentDate,
          label: "Last 30 Days",
        };
      case "last3months":
        return {
          start: subMonths(currentDate, 3),
          end: currentDate,
          label: "Last 3 Months",
        };
      case "last6months":
        return {
          start: subMonths(currentDate, 6),
          end: currentDate,
          label: "Last 6 Months",
        };
      case "thisMonth":
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
          label: "This Month",
        };
      case "custom":
        return {
          start: startOfMonth(month),
          end: endOfMonth(month),
          label: format(month, "MMMM yyyy"),
        };
      default:
        return {
          start: subMonths(currentDate, 1),
          end: currentDate,
          label: "Last 30 Days",
        };
    }
  };

  const dateRange = getDateRange();

  // Filter expenses based on date range
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate >= dateRange.start && expenseDate <= dateRange.end
    );
  });

  // Calculate total for filtered expenses
  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Group expenses by category for the filtered time period
  const filteredByCategory = expensesByCategory
    .map((category) => {
      const amount = filteredExpenses
        .filter((expense) => expense.category === category.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return { category: category.category, amount };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Handle navigation between months in custom view
  const handlePreviousMonth = () => {
    setMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(month.getMonth() + 1);
    
    // Don't allow future months
    if (nextMonth <= currentDate) {
      setMonth(nextMonth);
    }
  };

  // Download report as CSV
  const downloadCSV = () => {
    // Create CSV content
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = filteredExpenses.map((expense) => [
      expense.date,
      expense.category,
      expense.description,
      expense.amount.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `expense_report_${format(dateRange.start, "yyyy-MM-dd")}_to_${format(dateRange.end, "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analyze your spending patterns over time.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="custom">Custom Month</SelectItem>
              </SelectContent>
            </Select>

            {timeRange === "custom" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !month && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(month, "MMMM yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={month}
                      onSelect={(date) => date && setMonth(date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      month={month}
                      onMonthChange={setMonth}
                      captionLayout="dropdown-buttons"
                      fromMonth={new Date(2000, 0)}
                      toMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  disabled={month.getMonth() === currentDate.getMonth() && 
                           month.getFullYear() === currentDate.getFullYear()}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            onClick={downloadCSV}
            className="h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Summary for {dateRange.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold">${filteredTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Number of Transactions</p>
                <p className="text-3xl font-bold">{filteredExpenses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Per Transaction</p>
                <p className="text-3xl font-bold">
                  $
                  {filteredExpenses.length
                    ? (filteredTotal / filteredExpenses.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Top Category</p>
                <p className="text-3xl font-bold">
                  {filteredByCategory.length
                    ? filteredByCategory[0].category
                    : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpensePieChart />
              <ExpenseBarChart />
            </div>
            <ExpenseLineChart />
          </TabsContent>
          
          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredByCategory.length > 0 ? (
                    filteredByCategory.map((item, index) => (
                      <div key={item.category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.category}</span>
                          <span className="font-semibold">${item.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${(item.amount / filteredTotal) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                          <span>
                            {((item.amount / filteredTotal) * 100).toFixed(1)}%
                          </span>
                          <span>
                            {filteredExpenses.filter(
                              (e) => e.category === item.category
                            ).length} transactions
                          </span>
                        </div>
                        {index < filteredByCategory.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No expenses found for this time period.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
