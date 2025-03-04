
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { useExpenses, Expense } from "@/context/ExpenseContext";
import Navbar from "@/components/Navbar";

// Categories for the select input
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
  "Other",
];

// Form schema
const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .refine((val) => !isNaN(val), {
      message: "Amount must be a valid number",
    }),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(1, "Description is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { addExpense, updateExpense, expenses } = useExpenses();
  const [isLoading, setIsLoading] = useState(false);

  // Get expense data from URL params if editing
  const editExpense = id
    ? location.state?.expense || expenses.find((e) => e.id === id)
    : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: editExpense ? editExpense.amount : undefined,
      category: editExpense ? editExpense.category : "",
      description: editExpense ? editExpense.description : "",
      date: editExpense ? new Date(editExpense.date) : new Date(),
    },
  });

  // If in edit mode but no expense found, redirect to dashboard
  useEffect(() => {
    if (id && !editExpense) {
      navigate("/dashboard");
    }
  }, [id, editExpense, navigate]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    // Format date to ISO string and take only the date part
    const formattedDate = values.date.toISOString().split("T")[0];
    
    if (id && editExpense) {
      // Update existing expense
      updateExpense({
        id,
        amount: values.amount,
        category: values.category,
        description: values.description,
        date: formattedDate,
      });
    } else {
      // Add new expense
      addExpense({
        amount: values.amount,
        category: values.category,
        description: values.description,
        date: formattedDate,
      });
    }
    
    // Simulate some loading to provide feedback
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="max-w-xl mx-auto shadow-sm animate-fade-in">
          <CardHeader>
            <CardTitle>{id ? "Edit Expense" : "Add New Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What did you spend on?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Saving..."
                      : id
                      ? "Update Expense"
                      : "Add Expense"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExpenseForm;
