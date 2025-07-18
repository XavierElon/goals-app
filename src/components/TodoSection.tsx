'use client'

import React from 'react'
import { Todo } from './types'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'
import { CompletedTodos } from './CompletedTodos'

interface TodoSectionProps {
  todos: Todo[]
  onAddTodo: (todoData: { title: string; description: string; priority: string; dueDate: string }) => Promise<void>
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onReorder: (todos: Todo[]) => void
  onPriorityChange: (id: string, priority: string) => void
}

export function TodoSection({
  todos,
  onAddTodo,
  onToggleCompletion,
  onEdit,
  onDelete,
  onReorder,
  onPriorityChange
}: TodoSectionProps) {
  const activeTodos = todos.filter(todo => !todo.isCompleted)
  const completedTodos = todos.filter(todo => todo.isCompleted)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">To-Do List</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your tasks and daily activities. Drag tasks to reorder them by priority.</p>
      </div>
      
      {/* Add Todo Form */}
      <TodoForm onSubmit={onAddTodo} />

      {/* Active Todos List */}
      {activeTodos.length === 0 && completedTodos.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No tasks yet. Add your first task above!
        </div>
      ) : (
        <>
          {/* Active Todos */}
          {activeTodos.length > 0 && (
            <TodoList
              todos={activeTodos}
              onToggleCompletion={onToggleCompletion}
              onEdit={onEdit}
              onDelete={onDelete}
              onReorder={onReorder}
              onPriorityChange={onPriorityChange}
            />
          )}

          {/* Completed Todos Section */}
          <CompletedTodos
            completedTodos={completedTodos}
            onToggleCompletion={onToggleCompletion}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  )
} 