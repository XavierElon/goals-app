'use client'

import React from 'react'
import { Goal } from './types'
import { GoalList } from './GoalList'

interface GoalSectionProps {
  title: string
  description: string
  goals: Goal[]
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
  goalType: 'daily' | 'one-time'
  onReorder: (goals: Goal[]) => void
}

export function GoalSection({
  title,
  description,
  goals,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onEdit,
  onDelete,
  onDropdownClick,
  openDropdown,
  goalType,
  onReorder
}: GoalSectionProps) {
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
      <GoalList
        goals={goals}
        goalType={goalType}
        onToggleCompletion={onToggleCompletion}
        onToggleOneTimeGoal={onToggleOneTimeGoal}
        onEdit={onEdit}
        onDelete={onDelete}
        onDropdownClick={onDropdownClick}
        openDropdown={openDropdown}
        onReorder={onReorder}
            />
    </div>
  )
} 