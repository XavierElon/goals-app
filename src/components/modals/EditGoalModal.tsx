'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Goal } from '../types'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const EditGoalSchema = z.object({
  title: z.string().min(1, {
    message: "Goal title is required.",
  }).max(100, {
    message: "Goal title must be less than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must be less than 500 characters.",
  }).optional(),
  goalType: z.string(),
  status: z.string().optional(),
})

type EditGoalData = z.infer<typeof EditGoalSchema>

interface EditGoalModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onGoalChange: (goal: Goal) => void
}

export function EditGoalModal({ goal, isOpen, onClose, onSubmit, onGoalChange }: EditGoalModalProps) {
  const form = useForm<EditGoalData>({
    resolver: zodResolver(EditGoalSchema),
    defaultValues: {
      title: goal?.title || "",
      description: goal?.description || "",
      goalType: goal?.goalType || "daily",
      status: goal?.status || "in-progress",
    },
  })

  // Reset form when goal changes
  React.useEffect(() => {
    if (goal) {
      form.reset({
        title: goal.title,
        description: goal.description || "",
        goalType: goal.goalType,
        status: goal.status || "in-progress",
      })
    }
  }, [goal, form])

  if (!goal) return null

  function handleSubmit(data: EditGoalData) {
    if (!goal) return
    const updatedGoal: Goal = {
      id: goal.id,
      title: data.title,
      description: data.description || "",
      goalType: data.goalType,
      status: data.status || goal.status,
      isCompleted: goal.isCompleted,
      createdAt: goal.createdAt,
      completions: goal.completions,
      completedAt: goal.completedAt,
    }
    onGoalChange(updatedGoal)
    onSubmit(new Event('submit') as unknown as React.FormEvent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Make changes to your goal here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
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
            
            {form.watch("goalType") === 'one-time' && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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