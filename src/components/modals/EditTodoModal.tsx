'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Todo } from '../types'
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-600 text-white animate-pulse'
    case 'low':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return '🚨 URGENT'
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    case 'high':
      return 'High'
    default:
      return 'Medium'
  }
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const EditTodoSchema = z.object({
  title: z.string().min(1, {
    message: "Task title is required.",
  }).max(100, {
    message: "Task title must be less than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must be less than 500 characters.",
  }).optional(),
  priority: z.string(),
  dueDate: z.date().optional(),
})

type EditTodoData = z.infer<typeof EditTodoSchema>

interface EditTodoModalProps {
  todo: Todo | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onTodoChange: (todo: Todo) => void
}

export function EditTodoModal({ todo, isOpen, onClose, onSubmit, onTodoChange }: EditTodoModalProps) {
  const form = useForm<EditTodoData>({
    resolver: zodResolver(EditTodoSchema),
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      priority: todo?.priority || "medium",
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : undefined,
    },
  })

  // Reset form when todo changes
  React.useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      })
    }
  }, [todo, form])

  if (!todo) return null

  async function handleSubmit(data: EditTodoData) {
    if (!todo) return
    const updatedTodo: Todo = {
      id: todo.id,
      title: data.title,
      description: data.description || "",
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : undefined,
      isCompleted: todo.isCompleted,
      createdAt: todo.createdAt,
    }
    onTodoChange(updatedTodo)
    onSubmit(new Event('submit') as unknown as React.FormEvent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide additional details about your task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity border border-gray-300 bg-white ${getPriorityColor(field.value)}`}>
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
            
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 