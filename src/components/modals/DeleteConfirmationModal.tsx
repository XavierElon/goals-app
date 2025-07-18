'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  itemType: 'goal' | 'todo'
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationModal({ isOpen, itemType, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {itemType === 'goal' ? 'Goal' : 'Task'}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {itemType}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3">
          <Button 
            onClick={onConfirm}
            variant="destructive"
            className="flex-1"
          >
            Delete
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 