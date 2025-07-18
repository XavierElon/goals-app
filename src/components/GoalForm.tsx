'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/stateful-button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const GoalFormSchema = z.object({
  title: z.string().min(1, {
    message: "Goal title is required.",
  }).max(100, {
    message: "Goal title must be less than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must be less than 500 characters.",
  }).optional(),
  goalType: z.enum(["daily", "one-time"]),
  targetDate: z.date().optional(),
}).refine((data) => {
  if (data.goalType === "one-time") {
    return data.targetDate !== undefined;
  }
  return true;
}, {
  message: "Target date is required for one-time goals.",
  path: ["targetDate"],
});

type GoalFormData = z.infer<typeof GoalFormSchema>

interface GoalFormProps {
  onSubmit: (goal: { title: string; description: string; goalType: string; targetDate?: string }) => Promise<void>
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const form = useForm<GoalFormData>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalType: "daily",
    },
  })

  const selectedGoalType = form.watch("goalType")

  async function handleSubmit(data: GoalFormData) {
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: data.title,
        description: data.description || "",
        goalType: data.goalType,
        targetDate: data.targetDate ? format(data.targetDate, "yyyy-MM-dd") : undefined,
      })
      
      // Reset form after submission
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your goal..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Add a description..." {...field} />
                </FormControl>
                <FormDescription>
                  Provide additional details about your goal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="goalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily Goal</SelectItem>
                        <SelectItem value="one-time">One-time Goal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {selectedGoalType === "one-time" && (
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Target Date</FormLabel>
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
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" isSubmitting={isSubmitting}>
            Add Goal
          </Button>
        </form>
      </Form>
    </div>
  )
} 