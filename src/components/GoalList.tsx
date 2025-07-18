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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table'

interface GoalListProps {
  goals: Goal[]
  goalType: 'daily' | 'one-time'
  onToggleCompletion: (goalId: string, date: string) => void
  onToggleOneTimeGoal: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
  onReorder: (goals: Goal[]) => void
}

export function GoalList({
  goals,
  goalType,
  onToggleCompletion,
  onToggleOneTimeGoal,
  onStatusChange,
  onEdit,
  onDelete,
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                  <span>Goal</span>
                </div>
              </TableHead>
              {goalType === 'daily' ? (
                <>
                  <TableHead>Streak</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead>Total Completions</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <SortableGoalRow
                key={goal.id}
                goal={goal}
                goalType={goalType}
                onToggleCompletion={onToggleCompletion}
                onToggleOneTimeGoal={onToggleOneTimeGoal}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  )
} 