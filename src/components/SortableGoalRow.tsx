'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Goal } from './types'
import { getStreakCount, isCompletedToday, formatDueDate } from './utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface SortableGoalRowProps {
  goal: Goal
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

export function SortableGoalRow({
  goal,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onStatusChange,
  onEdit,
  onDelete
}: SortableGoalRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'on-hold':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'on-hold':
        return 'On Hold'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'In Progress'
    }
  }

  if (goalType === 'daily') {
    const streak = getStreakCount(goal.completions)
    const completedToday = isCompletedToday(goal.completions)

    return (
      <TableRow 
        ref={setNodeRef} 
        style={style} 
        className="hover:bg-gray-50 dark:hover:bg-gray-700"
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
                {goal.title}
              </div>
              {goal.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {goal.description}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              streak > 0 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <button
            onClick={() => onToggleCompletion(goal.id, new Date().toISOString())}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              completedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
            }`}
          >
            {completedToday && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </TableCell>
        <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
          {goal.completions.length}
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
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(goal.id)}
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

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className="hover:bg-gray-50 dark:hover:bg-gray-700"
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
              <div className={`text-sm font-medium ${
                goal.isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {goal.title}
              </div>
              {goal.description && (
                <div className={`text-sm ${
                  goal.isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {goal.description}
                </div>
              )}
            </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {goal.targetDate ? (
            <span className={new Date(goal.targetDate) < new Date() && !goal.isCompleted ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
              {formatDueDate(goal.targetDate)}
              {new Date(goal.targetDate) < new Date() && !goal.isCompleted && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">No target date</span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(goal.status)}`}>
              {getStatusText(goal.status)}
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onStatusChange(goal.id, 'not-started')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor('not-started')}`}>
                Not Started
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(goal.id, 'in-progress')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor('in-progress')}`}>
                In Progress
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(goal.id, 'on-hold')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor('on-hold')}`}>
                On Hold
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(goal.id, 'completed')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor('completed')}`}>
                Completed
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(goal.id, 'cancelled')}>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor('cancelled')}`}>
                Cancelled
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="px-6 py-4">
        <Button
          onClick={() => onToggleOneTimeGoal(goal.id)}
          variant="gradient"
          className="h-6 px-1.5 text-xs"
        >
          {goal.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
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
            <DropdownMenuItem onClick={() => onEdit(goal)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(goal.id)}
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

 