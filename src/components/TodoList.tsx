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
import { SortableTodoItem } from './SortableTodoItem'
import { Todo } from './types'
import { getPriorityColor, getPriorityText, formatDueDate, isOverdue } from './utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table'

interface TodoListProps {
  todos: Todo[]
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onReorder: (todos: Todo[]) => void
  onPriorityChange: (id: string, priority: string) => void
}

export function TodoList({
  todos,
  onToggleCompletion,
  onEdit,
  onDelete,
  onReorder,
  onPriorityChange
}: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((item) => item.id === active.id)
      const newIndex = todos.findIndex((item) => item.id === over?.id)
      const newTodos = arrayMove(todos, oldIndex, newIndex)
      onReorder(newTodos)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map(todo => todo.id)}
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
                  <span>Task</span>
                </div>
              </TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onToggleCompletion={onToggleCompletion}
                onEdit={onEdit}
                onDelete={onDelete}
                onPriorityChange={onPriorityChange}
                getPriorityColor={getPriorityColor}
                getPriorityText={getPriorityText}
                formatDueDate={formatDueDate}
                isOverdue={isOverdue}
              />
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  )
} 