'use client'

import React, { useState, useEffect } from 'react'
import { Goal } from '../types'

interface EditGoalModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function EditGoalModal({ goal, isOpen, onClose, onSubmit }: EditGoalModalProps) {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    if (goal) {
      setEditingGoal({ ...goal })
    }
  }, [goal])

  if (!isOpen || !editingGoal) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              id="edit-title"
              value={editingGoal.title}
              onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="edit-description"
              value={editingGoal.description || ''}
              onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="edit-goalType" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Type *
            </label>
            <select
              id="edit-goalType"
              value={editingGoal.goalType}
              onChange={(e) => setEditingGoal({ ...editingGoal, goalType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily Goal (track daily progress)</option>
              <option value="one-time">One-time Goal (achieve once)</option>
            </select>
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