'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableGoalRow } from './SortableGoalRow'
import { Goal } from './types'

interface GoalListProps {
  goals: Goal[]
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
  onReorder: (goals: Goal[]) => void
}

export function GoalList({
  goals,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onEdit,
  onDelete,
  onDropdownClick,
  openDropdown,
  onReorder
}: GoalListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = goals.findIndex((item) => item.id === active.id)
      const newIndex = goals.findIndex((item) => item.id === over?.id)
      const newGoals = arrayMove(goals, oldIndex, newIndex)
      onReorder(newGoals)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={goals.map(goal => goal.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {goalType === 'daily' ? (
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                      <span>Goal</span>
                    </div>
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
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                      <span>Goal</span>
                    </div>
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
                <SortableGoalRow
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
      </SortableContext>
    </DndContext>
  )
} 