'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
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
  index: number
  isHovered: boolean
  onHoverChange: (isHovered: boolean) => void
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onPriorityChange: (id: string, priority: string) => void
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
  formatDueDate: (dueDate: string) => string | null
  isOverdue: (dueDate: string, isCompleted: boolean) => boolean
}

export function SortableTodoItem({ 
  todo, 
  index,
  isHovered,
  onHoverChange,
  onToggleCompletion, 
  onEdit, 
  onDelete, 
  onPriorityChange,
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
      className={cn(
        "transition-colors duration-200",
        isHovered ? "bg-neutral-200/50 dark:bg-slate-800/50" : "hover:bg-gray-50"
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <TableCell className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-move p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {todo.title}
            </div>
            {todo.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {todo.description}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(todo.priority)}`}>
              {getPriorityText(todo.priority)}
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onPriorityChange(todo.id, 'urgent')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('urgent')}`}>
                🚨 URGENT
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange(todo.id, 'high')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('high')}`}>
                High
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange(todo.id, 'medium')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('medium')}`}>
                Medium
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange(todo.id, 'low')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor('low')}`}>
                Low
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {todo.dueDate ? (
            <span className={isOverdue(todo.dueDate, todo.isCompleted) ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
              {formatDueDate(todo.dueDate)}
              {isOverdue(todo.dueDate, todo.isCompleted) && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">No due date</span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleCompletion(todo.id, todo.isCompleted)
          }}
          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 flex items-center justify-center transition-colors"
        >
        </button>
      </TableCell>
      <TableCell className="px-6 py-4">
        <DropdownMenu>
                      <DropdownMenuTrigger asChild>
              <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
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