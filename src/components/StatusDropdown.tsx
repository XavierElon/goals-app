'use client'

import React from 'react'
import { Goal } from './types'

interface StatusDropdownProps {
  goal: Goal
  isOpen: boolean
  onToggle: (goalId: string) => void
  onStatusChange: (goalId: string, status: string) => void
}

export function StatusDropdown({ goal, isOpen, onToggle, onStatusChange }: StatusDropdownProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not Started'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'on-hold':
        return 'On Hold'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'In Progress'
    }
  }

  return (
    <div className="relative status-dropdown">
      <button
        onClick={() => onToggle(goal.id)}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(goal.status)}`}
      >
        {getStatusText(goal.status)}
        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 status-dropdown">
          <div className="py-1">
            {['not-started', 'in-progress', 'on-hold', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(goal.id, status)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  goal.status === status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 