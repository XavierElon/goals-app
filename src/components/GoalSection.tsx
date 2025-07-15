'use client'

import React from 'react'
import { Goal } from './types'
import { getStreakCount, isCompletedToday } from './utils'

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
  goalType
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
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {goalType === 'daily' ? (
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Completions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goals.map((goal) => (
              <GoalRow
                key={goal.id}
                goal={goal}
                goalType={goalType}
                onToggleCompletion={onToggleCompletion}
                onToggleOneTimeGoal={onToggleOneTimeGoal}
                onEdit={onEdit}
                onDelete={onDelete}
                onDropdownClick={onDropdownClick}
                openDropdown={openDropdown}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface GoalRowProps {
  goal: Goal
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
}

function GoalRow({
  goal,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onEdit,
  onDelete,
  onDropdownClick,
  openDropdown
}: GoalRowProps) {
  if (goalType === 'daily') {
    const streak = getStreakCount(goal.completions)
    const completedToday = isCompletedToday(goal.completions)

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {goal.title}
            </div>
            {goal.description && (
              <div className="text-sm text-gray-500">
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
        <td className="px-6 py-4">
          <button
            onClick={() => onToggleCompletion(goal.id, new Date().toISOString())}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
              completedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {completedToday && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {goal.completions.length}
        </td>
        <td className="px-6 py-4">
          <DropdownMenu
            id={goal.id}
            openDropdown={openDropdown}
            onDropdownClick={onDropdownClick}
            onEdit={() => onEdit(goal)}
            onDelete={() => onDelete(goal.id)}
          />
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className={`text-sm font-medium ${
            goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {goal.title}
          </div>
          {goal.description && (
            <div className={`text-sm ${
              goal.isCompleted ? 'text-gray-400' : 'text-gray-500'
            }`}>
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
        <button
          onClick={() => onToggleOneTimeGoal(goal.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            goal.isCompleted
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {goal.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
      </td>
      <td className="px-6 py-4">
        <DropdownMenu
          id={goal.id}
          openDropdown={openDropdown}
          onDropdownClick={onDropdownClick}
          onEdit={() => onEdit(goal)}
          onDelete={() => onDelete(goal.id)}
        />
      </td>
    </tr>
  )
}

interface DropdownMenuProps {
  id: string
  openDropdown: string | null
  onDropdownClick: (id: string) => void
  onEdit: () => void
  onDelete: () => void
}

function DropdownMenu({ id, openDropdown, onDropdownClick, onEdit, onDelete }: DropdownMenuProps) {
  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => onDropdownClick(id)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      
      {openDropdown === id && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit()
                onDropdownClick('')
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete()
                onDropdownClick('')
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 