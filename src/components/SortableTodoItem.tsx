'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from './types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableRow, TableCell } from '@/components/ui/table'

interface SortableTodoItemProps {
  todo: Todo
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
  formatDueDate: (dueDate: string) => string | null
  isOverdue: (dueDate: string, isCompleted: boolean) => boolean
}

export function SortableTodoItem({ 
  todo, 
  onToggleCompletion, 
  onEdit, 
  onDelete, 
  getPriorityColor, 
  getPriorityText, 
  formatDueDate, 
  isOverdue 
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className="hover:bg-gray-50"
    >
      <TableCell className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-move p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {todo.title}
            </div>
            {todo.description && (
              <div className="text-sm text-gray-500">
                {todo.description}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
          {getPriorityText(todo.priority)}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {todo.dueDate ? (
            <span className={isOverdue(todo.dueDate, todo.isCompleted) ? 'text-red-600 font-medium' : ''}>
              {formatDueDate(todo.dueDate)}
              {isOverdue(todo.dueDate, todo.isCompleted) && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-gray-400">No due date</span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleCompletion(todo.id, todo.isCompleted)
          }}
          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-green-400 flex items-center justify-center transition-colors"
        >
        </button>
      </TableCell>
      <TableCell className="px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(todo)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(todo.id)}
              variant="destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
} 