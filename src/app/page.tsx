'use client'

import React, { useState, useEffect, useMemo } from 'react'

// Import components
import { GoalForm } from '@/components/GoalForm'
import { TodoSection } from '@/components/TodoSection'
import { GoalSection } from '@/components/GoalSection'
import { EditGoalModal } from '@/components/modals/EditGoalModal'
import { EditTodoModal } from '@/components/modals/EditTodoModal'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'

// Import types
import { Goal, Todo } from '@/components/types'

export default function Home() {
  // State
  const [goals, setGoals] = useState<Goal[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTodoEditModal, setShowTodoEditModal] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null)
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)

  // Computed values
  const dailyGoals = useMemo(() => goals.filter(goal => goal.goalType === 'daily'), [goals])
  const oneTimeGoals = useMemo(() => goals.filter(goal => goal.goalType === 'one-time'), [goals])

  // Effects
  useEffect(() => {
    fetchGoals()
    fetchTodos()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownOpen && !(event.target as Element).closest('.status-dropdown')) {
        setStatusDropdownOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [statusDropdownOpen])

  // API Functions
  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setTodos([])
    }
  }

  const addGoal = async (goalData: { title: string; description: string; goalType: string }) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description,
          goalType: goalData.goalType,
          status: goalData.goalType === 'one-time' ? 'in-progress' : 'in-progress'
        }),
      })

      if (response.ok) {
        fetchGoals()
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const addTodo = async (todoData: { title: string; description: string; priority: string; dueDate: string }) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const editGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal || !editingGoal.title.trim()) return

    try {
      const response = await fetch(`/api/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingGoal.title,
          description: editingGoal.description,
          goalType: editingGoal.goalType,
          status: editingGoal.status
        }),
      })

      if (response.ok) {
        setShowEditModal(false)
        setEditingGoal(null)
        fetchGoals()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const editTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTodo || !editingTodo.title.trim()) return

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTodo.title,
          description: editingTodo.description,
          priority: editingTodo.priority,
          dueDate: editingTodo.dueDate
        }),
      })

      if (response.ok) {
        setShowTodoEditModal(false)
        setEditingTodo(null)
        fetchTodos()
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeletingGoal(null)
        fetchGoals()
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const deleteTodo = async (todoId: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeletingTodo(null)
        fetchTodos()
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleTodoCompletion = async (todoId: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error toggling todo completion:', error)
    }
  }

  const toggleCompletion = async (goalId: string, date: string) => {
    const today = new Date().toISOString().split('T')[0]
    const isCompleted = goals
      .find(g => g.id === goalId)
      ?.completions.some(c => c.date.startsWith(today))

    try {
      if (isCompleted) {
        await fetch(`/api/goals/${goalId}/completions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: today }),
        })
      } else {
        await fetch(`/api/goals/${goalId}/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: today }),
        })
      }
      fetchGoals()
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  const toggleOneTimeGoal = async (goalId: string) => {
    try {
      await fetch(`/api/goals/${goalId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      fetchGoals()
    } catch (error) {
      console.error('Error toggling one-time goal:', error)
    }
  }

  const reorderGoals = async (reorderedGoals: Goal[]) => {
    try {
      // Update the order field for each goal based on its new position
      const updatePromises = reorderedGoals.map((goal, index) =>
        fetch(`/api/goals/${goal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: index }),
        })
      )

      await Promise.all(updatePromises)
      fetchGoals()
    } catch (error) {
      console.error('Error reordering goals:', error)
    }
  }

  // Event Handlers
  const openEditModal = (goal: Goal) => {
    setEditingGoal({ ...goal })
    setShowEditModal(true)
  }

  const openTodoEditModal = (todo: Todo) => {
    setEditingTodo({ ...todo })
    setShowTodoEditModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading goals...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Goals & Tasks Tracker
        </h1>

        {/* Add Goal Form */}
        <GoalForm onSubmit={addGoal} />

        {/* Daily Goals Section */}
        <GoalSection
          title="Daily Goals"
          description="Track your daily habits and routines"
          goals={dailyGoals}
          onToggleCompletion={toggleCompletion}
          onToggleOneTimeGoal={toggleOneTimeGoal}
          onEdit={openEditModal}
          onDelete={setDeletingGoal}
          onDropdownClick={setStatusDropdownOpen}
          openDropdown={statusDropdownOpen}
          goalType="daily"
          onReorder={reorderGoals}
        />

        {/* One-time Goals Section */}
        <GoalSection
          title="One-time Goals"
          description="Achieve these goals once and mark them complete"
          goals={oneTimeGoals}
          onToggleCompletion={toggleCompletion}
          onToggleOneTimeGoal={toggleOneTimeGoal}
          onEdit={openEditModal}
          onDelete={setDeletingGoal}
          onDropdownClick={setStatusDropdownOpen}
          openDropdown={statusDropdownOpen}
          goalType="one-time"
          onReorder={reorderGoals}
        />

        {/* To-Do List Section */}
        <TodoSection
          todos={todos}
          onAddTodo={addTodo}
          onToggleCompletion={toggleTodoCompletion}
          onEdit={openTodoEditModal}
          onDelete={setDeletingTodo}
          onReorder={(reorderedTodos) => {
            setTodos(reorderedTodos)
          }}
        />

        {/* Modals */}
        <EditGoalModal
          goal={editingGoal}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingGoal(null)
          }}
          onSubmit={editGoal}
          onGoalChange={setEditingGoal}
        />

        <EditTodoModal
          todo={editingTodo}
          isOpen={showTodoEditModal}
          onClose={() => {
            setShowTodoEditModal(false)
            setEditingTodo(null)
          }}
          onSubmit={editTodo}
          onTodoChange={setEditingTodo}
        />

        <DeleteConfirmationModal
          isOpen={!!deletingGoal}
          itemType="goal"
          onConfirm={() => deletingGoal && deleteGoal(deletingGoal)}
          onCancel={() => setDeletingGoal(null)}
        />

        <DeleteConfirmationModal
          isOpen={!!deletingTodo}
          itemType="todo"
          onConfirm={() => deletingTodo && deleteTodo(deletingTodo)}
          onCancel={() => setDeletingTodo(null)}
        />
      </div>
    </div>
  )
}
