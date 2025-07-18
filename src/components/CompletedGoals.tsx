'use client'

import React, { useState } from 'react'
import { Goal } from './types'
import { getStreakCount, isCompletedToday, formatCompletionDate } from './utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CompletedGoalsProps {
  completedGoals: Goal[]
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onDelete: (goalId: string) => void
}

export function CompletedGoals({
  completedGoals,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onDelete
}: CompletedGoalsProps) {
  const [showCompletedGoals, setShowCompletedGoals] = useState(false)

  if (completedGoals.length === 0) {
    return null
  }

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setShowCompletedGoals(!showCompletedGoals)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Completed {goalType === 'daily' ? 'Daily Goals' : 'One-time Goals'} ({completedGoals.length})
          </span>
          <span className="text-xs text-gray-500">
            Click to {showCompletedGoals ? 'hide' : 'show'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                {goalType === 'daily' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completions
                    </th>
                  </>
                )}
                {goalType === 'one-time' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedGoals.map((goal) => (
                <CompletedGoalRow
                  key={goal.id}
                  goal={goal}
                  goalType={goalType}
                  onToggleCompletion={onToggleCompletion}
                  onToggleOneTimeGoal={onToggleOneTimeGoal}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface CompletedGoalRowProps {
  goal: Goal
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onDelete: (goalId: string) => void
}

function CompletedGoalRow({
  goal,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onDelete
}: CompletedGoalRowProps) {
  if (goalType === 'daily') {
    const streak = getStreakCount(goal.completions)
    const completedToday = isCompletedToday(goal.completions)

    return (
      <tr className="bg-gray-50 hover:bg-gray-100">
        <td className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-500 line-through">
              {goal.title}
            </div>
            {goal.description && (
              <div className="text-sm text-gray-400 line-through">
                {goal.description}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              streak > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {goal.completions.length}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              completedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300'
            }`}>
              {completedToday && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {completedToday ? 'Today' : 'Previously'}
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
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
        </td>
      </tr>
    )
  }

  return (
    <tr className="bg-gray-50 hover:bg-gray-100">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-500 line-through">
            {goal.title}
          </div>
          {goal.description && (
            <div className="text-sm text-gray-400 line-through">
              {goal.description}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          goal.isCompleted
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {goal.isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            {goal.isCompleted ? 'Completed' : 'Unknown'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
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
      </td>
    </tr>
  )
} 