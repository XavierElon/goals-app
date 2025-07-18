'use client'

import React from 'react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  itemType: 'goal' | 'todo'
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationModal({ isOpen, itemType, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Delete {itemType === 'goal' ? 'Goal' : 'Task'}</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
} 