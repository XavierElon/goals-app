'use client'

import React, { useState } from 'react'
import { Goal } from './types'
import { getStreakCount, isCompletedToday, formatCompletionDate, formatDueDate } from './utils'
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

interface CompletedGoalsProps {
  completedGoals: Goal[]
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
  onDelete: (goalId: string) => void
}

export function CompletedGoals({
  completedGoals,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onStatusChange,
  onDelete
}: CompletedGoalsProps) {
  const [showCompletedGoals, setShowCompletedGoals] = useState(false)

  if (completedGoals.length === 0) {
    return null
  }

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setShowCompletedGoals(!showCompletedGoals)}
        className="w-full px-6 py-4 text-left bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">
            Completed {goalType === 'daily' ? 'Daily Goals' : 'One-time Goals'} ({completedGoals.length})
          </span>
          <span className="text-xs text-muted-foreground">
            Click to {showCompletedGoals ? 'hide' : 'show'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            showCompletedGoals ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showCompletedGoals && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              {goalType === 'daily' && (
                <>
                  <TableHead>Streak</TableHead>
                  <TableHead>Completions</TableHead>
                </>
              )}
              {goalType === 'one-time' && (
                <>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
              <TableHead>Completed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedGoals.map((goal) => (
              <CompletedGoalRow
                key={goal.id}
                goal={goal}
                goalType={goalType}
                onToggleCompletion={onToggleCompletion}
                onToggleOneTimeGoal={onToggleOneTimeGoal}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

interface CompletedGoalRowProps {
  goal: Goal
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
  onDelete: (goalId: string) => void
}

function CompletedGoalRow({
  goal,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onStatusChange,
  onDelete
}: CompletedGoalRowProps) {
  if (goalType === 'daily') {
    const streak = getStreakCount(goal.completions)
    const completedToday = isCompletedToday(goal.completions)

    return (
      <TableRow className="bg-muted/30 hover:bg-muted/50">
        <TableCell className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground line-through">
              {goal.title}
            </div>
            {goal.description && (
              <div className="text-sm text-muted-foreground/70 line-through">
                {goal.description}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              streak > 0 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4 text-sm text-muted-foreground">
          {goal.completions.length}
        </TableCell>
        <TableCell className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              completedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-muted-foreground/30'
            }`}>
              {completedToday && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {completedToday ? 'Today' : 'Previously'}
            </div>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground focus:outline-none">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleCompletion(goal.id, new Date().toISOString())}>
                Mark Incomplete
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
      <TableRow className="bg-muted/30 hover:bg-muted/50">
        <TableCell className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground line-through">
              {goal.title}
            </div>
            {goal.description && (
              <div className="text-sm text-muted-foreground/70 line-through">
                {goal.description}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {goal.targetDate ? (
              <span className={new Date(goal.targetDate) < new Date(goal.completedAt || '') ? 'text-red-500' : ''}>
                {formatDueDate(goal.targetDate)}
                {new Date(goal.targetDate) < new Date(goal.completedAt || '') && ' (Was Overdue)'}
              </span>
            ) : (
              <span className="text-muted-foreground/70">No target date</span>
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-muted-foreground">
              {goal.completedAt ? formatCompletionDate(goal.completedAt) : 'Unknown'}
            </div>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <DropdownMenu>
                      <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground focus:outline-none">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleOneTimeGoal(goal.id)}>
              Mark Incomplete
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