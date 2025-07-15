'use client'

import React, { useState } from 'react'

interface GoalFormProps {
  onSubmit: (goal: { title: string; description: string; goalType: string }) => void
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [newGoal, setNewGoal] = useState({ title: '', description: '', goalType: 'daily' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    onSubmit(newGoal)
    setNewGoal({ title: '', description: '', goalType: 'daily' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title *
          </label>
          <input
            type="text"
            id="title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your goal..."
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a description..."
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="goalType" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Type *
          </label>
          <select
            id="goalType"
            value={newGoal.goalType}
            onChange={(e) => setNewGoal({ ...newGoal, goalType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily Goal (track daily progress)</option>
            <option value="one-time">One-time Goal (achieve once)</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Goal
        </button>
      </form>
    </div>
  )
} 