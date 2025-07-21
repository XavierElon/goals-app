'use client'

import React, { useState } from 'react'
import { Todo } from './types'
import { getPriorityColor, getPriorityText, formatDueDate, formatCompletionDate, isOverdue } from './utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

interface CompletedTodosProps {
  completedTodos: Todo[]
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
}

export function CompletedTodos({
  completedTodos,
  onToggleCompletion,
  onDelete
}: CompletedTodosProps) {
  const [showCompletedTodos, setShowCompletedTodos] = useState(false)

  if (completedTodos.length === 0) {
    return null
  }

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setShowCompletedTodos(!showCompletedTodos)}
        className="w-full px-6 py-4 text-left bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">
            Completed Tasks ({completedTodos.length})
          </span>
          <span className="text-xs text-muted-foreground">
            Click to {showCompletedTodos ? 'hide' : 'show'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            showCompletedTodos ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showCompletedTodos && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTodos.map((todo) => (
              <CompletedTodoRow
                key={todo.id}
                todo={todo}
                onToggleCompletion={onToggleCompletion}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

interface CompletedTodoRowProps {
  todo: Todo
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
}

function CompletedTodoRow({
  todo,
  onToggleCompletion,
  onDelete
}: CompletedTodoRowProps) {
  return (
    <TableRow className="bg-muted/30 hover:bg-muted/50">
      <TableCell className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground line-through">
            {todo.title}
          </div>
          {todo.description && (
            <div className="text-sm text-muted-foreground/70 line-through">
              {todo.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
          {getPriorityText(todo.priority)}
        </span>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="text-sm text-muted-foreground">
          {todo.dueDate ? (
            <span className={isOverdue(todo.dueDate, todo.isCompleted) ? 'text-red-500' : ''}>
              {formatDueDate(todo.dueDate)}
              {isOverdue(todo.dueDate, todo.isCompleted) && ' (Was Overdue)'}
            </span>
          ) : (
            <span className="text-muted-foreground/70">No due date</span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-muted-foreground">
            {todo.completedAt ? formatCompletionDate(todo.completedAt) : 'Unknown'}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground focus:outline-none">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleCompletion(todo.id, todo.isCompleted)}>
              Reopen
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