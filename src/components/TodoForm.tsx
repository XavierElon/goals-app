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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getPriorityColor, getPriorityText } from "./utils"

const TodoFormSchema = z.object({
  title: z.string().min(1, {
    message: "Task title is required.",
  }).max(100, {
    message: "Task title must be less than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must be less than 500 characters.",
  }).optional(),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  dueDate: z.date().optional(),
})

type TodoFormData = z.infer<typeof TodoFormSchema>

interface TodoFormProps {
  onSubmit: (todo: { title: string; description: string; priority: string; dueDate: string }) => Promise<void>
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const form = useForm<TodoFormData>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  })

  async function handleSubmit(data: TodoFormData) {
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : "",
      })
      
      // Reset form after submission
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your task..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors border border-gray-300 bg-white">
                            {getPriorityText(field.value)}
                            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => field.onChange('urgent')}>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('urgent')}`}>
                              🚨 URGENT
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => field.onChange('high')}>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('high')}`}>
                              High
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => field.onChange('medium')}>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('medium')}`}>
                              Medium
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => field.onChange('low')}>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('low')}`}>
                              Low
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
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
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Add details about this task..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide additional details about your task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-center">
            <Button type="submit" variant="gradient" isSubmitting={isSubmitting}>
              Add Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 