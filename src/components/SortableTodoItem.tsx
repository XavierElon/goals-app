'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Todo } from './types'

interface SortableTodoItemProps {
  todo: Todo
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
  formatDueDate: (dueDate: string) => string | null
  isOverdue: (dueDate: string, isCompleted: boolean) => boolean
}

export function SortableTodoItem({ 
  todo, 
  onToggleCompletion, 
  onEdit, 
  onDelete, 
  onDropdownClick, 
  openDropdown, 
  getPriorityColor, 
  getPriorityText, 
  formatDueDate, 
  isOverdue 
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-move p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {todo.title}
            </div>
            {todo.description && (
              <div className="text-sm text-gray-500">
                {todo.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
          {getPriorityText(todo.priority)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {todo.dueDate ? (
            <span className={isOverdue(todo.dueDate, todo.isCompleted) ? 'text-red-600 font-medium' : ''}>
              {formatDueDate(todo.dueDate)}
              {isOverdue(todo.dueDate, todo.isCompleted) && ' (Overdue)'}
            </span>
          ) : (
            <span className="text-gray-400">No due date</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleCompletion(todo.id, todo.isCompleted)
          }}
          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-green-400 flex items-center justify-center transition-colors"
        >
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="relative dropdown-container">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDropdownClick(todo.id)
            }}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {openDropdown === todo.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(todo)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(todo.id)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
} 