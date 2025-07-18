'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
})

type GoalFormData = z.infer<typeof GoalFormSchema>

interface GoalFormProps {
  onSubmit: (goal: { title: string; description: string; goalType: string }) => void
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(GoalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalType: "daily",
    },
  })

  function handleSubmit(data: GoalFormData) {
    onSubmit({
      title: data.title,
      description: data.description || "",
      goalType: data.goalType,
    })
    
    // Reset form after submission
    form.reset()
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
                    <SelectItem value="daily">Daily Goal (track daily progress)</SelectItem>
                    <SelectItem value="one-time">One-time Goal (achieve once)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Add Goal
          </Button>
        </form>
      </Form>
    </div>
  )
} 