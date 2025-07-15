'use client'

import React, { useState, useEffect } from 'react'
import { 
  GoalForm, 
  TodoSection,
  GoalSection,
  EditGoalModal,
  EditTodoModal,
  DeleteConfirmationModal,
  Goal, 
  Todo,
  getPriorityColor,
  getPriorityText,
  formatDueDate,
  formatCompletionDate,
  isOverdue,
  getStreakCount,
  isCompletedToday
} from '../components'

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTodoEditModal, setShowTodoEditModal] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null)
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    fetchGoals()
    fetchTodos()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

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
        body: JSON.stringify(goalData),
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
          goalType: editingGoal.goalType
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

  const openEditModal = (goal: Goal) => {
    setEditingGoal({ ...goal })
    setShowEditModal(true)
  }

  const openTodoEditModal = (todo: Todo) => {
    setEditingTodo({ ...todo })
    setShowTodoEditModal(true)
  }

  const handleDropdownClick = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
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
        // Remove completion
        await fetch(`/api/goals/${goalId}/completions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: today }),
        })
      } else {
        // Add completion
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

  const handleTodoReorder = (newTodos: Todo[]) => {
    setTodos(newTodos)
  }

  const dailyGoals = goals.filter(goal => goal.goalType === 'daily')
  const oneTimeGoals = goals.filter(goal => goal.goalType === 'one-time')

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
          onDropdownClick={handleDropdownClick}
          openDropdown={openDropdown}
          goalType="daily"
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
          onDropdownClick={handleDropdownClick}
          openDropdown={openDropdown}
          goalType="one-time"
        />

        {/* To-Do List Section */}
        <TodoSection
          todos={todos}
          onAddTodo={addTodo}
          onToggleCompletion={toggleTodoCompletion}
          onEdit={openTodoEditModal}
          onDelete={setDeletingTodo}
          onDropdownClick={handleDropdownClick}
          openDropdown={openDropdown}
          onReorder={handleTodoReorder}
        />

        {/* Edit Goal Modal */}
        <EditGoalModal
          goal={editingGoal}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingGoal(null)
          }}
          onSubmit={editGoal}
        />

        {/* Edit Todo Modal */}
        <EditTodoModal
          todo={editingTodo}
          isOpen={showTodoEditModal}
          onClose={() => {
            setShowTodoEditModal(false)
            setEditingTodo(null)
          }}
          onSubmit={editTodo}
        />

        {/* Delete Goal Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!deletingGoal}
          title="Delete Goal"
          message="Are you sure you want to delete this goal? This action cannot be undone."
          onConfirm={() => deleteGoal(deletingGoal!)}
          onCancel={() => setDeletingGoal(null)}
        />

        {/* Delete Todo Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!deletingTodo}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => deleteTodo(deletingTodo!)}
          onCancel={() => setDeletingTodo(null)}
        />
      </div>
    </div>
  )
}
