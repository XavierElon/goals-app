'use client'

import React, { useState, useEffect } from 'react'
import { Todo } from '../types'

interface EditTodoModalProps {
  todo: Todo | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function EditTodoModal({ todo, isOpen, onClose, onSubmit }: EditTodoModalProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  useEffect(() => {
    if (todo) {
      setEditingTodo({ ...todo })
    }
  }, [todo])

  if (!isOpen || !editingTodo) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-todo-title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="edit-todo-title"
              value={editingTodo.title}
              onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-todo-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="edit-todo-description"
              value={editingTodo.description || ''}
              onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-todo-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="edit-todo-priority"
                value={editingTodo.priority}
                onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-todo-dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="edit-todo-dueDate"
                value={editingTodo.dueDate || ''}
                onChange={(e) => setEditingTodo({ ...editingTodo, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 