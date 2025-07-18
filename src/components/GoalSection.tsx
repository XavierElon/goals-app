'use client'

import React from 'react'
import { Goal } from './types'
import { GoalList } from './GoalList'
import { CompletedGoals } from './CompletedGoals'
import { isCompletedToday } from './utils'

interface GoalSectionProps {
  title: string
  description: string
  goals: Goal[]
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  goalType: 'daily' | 'one-time'
  onReorder: (goals: Goal[]) => void
}

export function GoalSection({
  title,
  description,
  goals,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onStatusChange,
  onEdit,
  onDelete,
  goalType,
  onReorder
}: GoalSectionProps) {
  const activeGoals = goals.filter(goal => {
    if (goalType === 'daily') {
      return !isCompletedToday(goal.completions)
    } else {
      return !goal.isCompleted
    }
  })
  
  const completedGoals = goals.filter(goal => {
    if (goalType === 'daily') {
      return isCompletedToday(goal.completions)
    } else {
      return goal.isCompleted
    }
  })

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-6 text-center text-gray-500">
          No {goalType} goals yet. Add your first {goalType} goal above!
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description} Drag goals to reorder them by priority.</p>
      </div>
      
      {/* Active Goals List */}
      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No {goalType} goals yet. Add your first {goalType} goal above!
        </div>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <GoalList
              goals={activeGoals}
              goalType={goalType}
              onToggleCompletion={onToggleCompletion}
              onToggleOneTimeGoal={onToggleOneTimeGoal}
              onEdit={onEdit}
              onDelete={onDelete}
              onReorder={onReorder}
              onStatusChange={onStatusChange}
            />
          )}

          {/* Completed Goals Section */}
          <CompletedGoals
            completedGoals={completedGoals}
            goalType={goalType}
            onToggleCompletion={onToggleCompletion}
            onToggleOneTimeGoal={onToggleOneTimeGoal}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  )
} 