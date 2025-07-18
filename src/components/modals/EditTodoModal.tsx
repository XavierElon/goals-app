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
  if (!todo) return null

  const form = useForm<EditTodoData>({
    resolver: zodResolver(EditTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    },
  })

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
      completedAt: todo.completedAt,
    }
    onTodoChange(updatedTodo)
    await onSubmit(new Event('submit') as any)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
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