'use client'

import React, { useState } from 'react'
import { Todo } from './types'
import { getPriorityColor, getPriorityText, formatDueDate, formatCompletionDate, isOverdue } from './utils'

interface CompletedTodosProps {
  completedTodos: Todo[]
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
}

export function CompletedTodos({
  completedTodos,
  onToggleCompletion,
  onDelete,
  onDropdownClick,
  openDropdown
}: CompletedTodosProps) {
  const [showCompletedTodos, setShowCompletedTodos] = useState(false)

  if (completedTodos.length === 0) {
    return null
  }

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setShowCompletedTodos(!showCompletedTodos)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Completed Tasks ({completedTodos.length})
          </span>
          <span className="text-xs text-gray-500">
            Click to {showCompletedTodos ? 'hide' : 'show'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            showCompletedTodos ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showCompletedTodos && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedTodos.map((todo) => (
                <CompletedTodoRow
                  key={todo.id}
                  todo={todo}
                  onToggleCompletion={onToggleCompletion}
                  onDelete={onDelete}
                  onDropdownClick={onDropdownClick}
                  openDropdown={openDropdown}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

interface CompletedTodoRowProps {
  todo: Todo
  onToggleCompletion: (id: string, isCompleted: boolean) => void
  onDelete: (id: string) => void
  onDropdownClick: (id: string) => void
  openDropdown: string | null
}

function CompletedTodoRow({
  todo,
  onToggleCompletion,
  onDelete,
  onDropdownClick,
  openDropdown
}: CompletedTodoRowProps) {
  return (
    <tr className="bg-gray-50 hover:bg-gray-100">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-500 line-through">
            {todo.title}
          </div>
          {todo.description && (
            <div className="text-sm text-gray-400 line-through">
              {todo.description}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
          {getPriorityText(todo.priority)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">
          {todo.dueDate ? (
            <span className={isOverdue(todo.dueDate, todo.isCompleted) ? 'text-red-500' : ''}>
              {formatDueDate(todo.dueDate)}
              {isOverdue(todo.dueDate, todo.isCompleted) && ' (Was Overdue)'}
            </span>
          ) : (
            <span className="text-gray-400">No due date</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-500 border-green-500 text-white flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            {todo.completedAt ? formatCompletionDate(todo.completedAt) : 'Unknown'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative dropdown-container">
          <button
            onClick={() => onDropdownClick(todo.id)}
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
                  onClick={() => {
                    onToggleCompletion(todo.id, todo.isCompleted)
                    onDropdownClick('')
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Reopen
                </button>
                <button
                  onClick={() => {
                    onDelete(todo.id)
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
      </td>
    </tr>
  )
} 