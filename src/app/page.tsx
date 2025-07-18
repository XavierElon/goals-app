'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Goal {
  id: string
  title: string
  description?: string
  goalType: string
  isCompleted: boolean
  status: string
  createdAt: string
  completions: Array<{
    id: string
    date: string
  }>
}

interface Todo {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  completedAt?: string
  priority: string
  dueDate?: string
  createdAt: string
}

// SortableRow component for drag and drop
function SortableRow({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
      {children}
    </tr>
  )
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [newGoal, setNewGoal] = useState({ title: '', description: '', goalType: 'daily', status: 'in-progress' })
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })
  const [loading, setLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTodoEditModal, setShowTodoEditModal] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState<string | null>(null)
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  const [showCompletedTodos, setShowCompletedTodos] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)
  const [goalOrder, setGoalOrder] = useState<string[]>([])
  const [oneTimeGoalOrder, setOneTimeGoalOrder] = useState<string[]>([])

  // DnD Kit setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter todos
  const activeTodos = todos.filter(todo => !todo.isCompleted)
  const completedTodos = todos.filter(todo => todo.isCompleted)
  const todoOrder = activeTodos.map(todo => todo.id)

  const handleTodoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDailyGoalDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        
        // Update order for all goals in the new order
        reorderedItems.forEach((goal, index) => {
          if (goal.goalType === 'daily') {
            updateGoalOrder(goal.id, index)
          }
        })
        
        return reorderedItems
      })
    }
  }

  const handleOneTimeGoalDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        
        // Update order for all goals in the new order
        reorderedItems.forEach((goal, index) => {
          if (goal.goalType === 'one-time') {
            updateGoalOrder(goal.id, index)
          }
        })
        
        return reorderedItems
      })
    }
  }

  useEffect(() => {
    fetchGoals()
    fetchTodos()
  }, [])

  const dailyGoals = useMemo(() => goals.filter(goal => goal.goalType === 'daily'), [goals])
  const oneTimeGoals = useMemo(() => goals.filter(goal => goal.goalType === 'one-time'), [goals])
  const todosArray = Array.isArray(todos) ? todos : []

  useEffect(() => {
    setGoalOrder(dailyGoals.map(goal => goal.id))
    setOneTimeGoalOrder(oneTimeGoals.map(goal => goal.id))
  }, [dailyGoals, oneTimeGoals])

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

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newGoal.title,
          description: newGoal.description,
          goalType: newGoal.goalType,
          status: newGoal.goalType === 'one-time' ? newGoal.status : 'in-progress'
        }),
      })

      if (response.ok) {
        setNewGoal({ title: '', description: '', goalType: 'daily', status: 'in-progress' })
        fetchGoals()
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })

      if (response.ok) {
        setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' })
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

  const openEditModal = (goal: Goal) => {
    setEditingGoal({ ...goal })
    setShowEditModal(true)
  }

  const openTodoEditModal = (todo: Todo) => {
    setEditingTodo({ ...todo })
    setShowTodoEditModal(true)
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

  const toggleCompletion = async (goalId: string) => {
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

  const updateGoalStatus = async (goalId: string, status: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setStatusDropdownOpen(null)
        fetchGoals()
      }
    } catch (error) {
      console.error('Error updating goal status:', error)
    }
  }

  const updateGoalOrder = async (goalId: string, order: number) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order }),
      })

      if (!response.ok) {
        console.error('Error updating goal order')
      }
    } catch (error) {
      console.error('Error updating goal order:', error)
    }
  }

  const getStreakCount = (completions: Array<{ date: string }>) => {
    if (completions.length === 0) return 0
    
    const sortedCompletions = completions
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime())
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i])
      completionDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const isCompletedToday = (completions: Array<{ date: string }>) => {
    const today = new Date().toISOString().split('T')[0]
    return completions.some(c => c.date.startsWith(today))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

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

  const formatDueDate = (dueDate: string) => {
    if (!dueDate) return null
    // Parse the date and format it consistently
    const date = new Date(dueDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = (dueDate: string, isCompleted: boolean) => {
    if (!dueDate || isCompleted) return false
    return new Date(dueDate) < new Date()
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
          <form onSubmit={addGoal} className="space-y-4">
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
                {newGoal.goalType === 'one-time' && (
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={newGoal.status}
                      onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Goal
            </button>
          </form>
        </div>

        {/* Daily Goals Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Daily Goals</h2>
            <p className="text-sm text-gray-500 mt-1">Track your daily habits and routines</p>
          </div>
          {dailyGoals.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No daily goals yet. Add your first daily goal above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDailyGoalDragEnd}>
                <SortableContext items={goalOrder} strategy={verticalListSortingStrategy}>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {/* Drag handle */}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Goal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Streak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Today
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Completions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goalOrder.map(id => {
                        const goal = dailyGoals.find(g => g.id === id)
                        if (!goal) return null
                        const streak = getStreakCount(goal.completions)
                        const completedToday = isCompletedToday(goal.completions)
                        return (
                          <SortableRow key={goal.id} id={goal.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"/>
                                </svg>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {goal.title}
                                </div>
                                {goal.description && (
                                  <div className="text-sm text-gray-500">
                                    {goal.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  streak > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {streak} day{streak !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleCompletion(goal.id)}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  completedToday
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {completedToday && (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {goal.completions.length}
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(goal)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setDeletingGoal(goal.id)} variant="destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </SortableRow>
                        )
                      })}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* One-time Goals Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">One-time Goals</h2>
            <p className="text-sm text-gray-500 mt-1">Achieve these goals once and mark them complete</p>
          </div>
          {oneTimeGoals.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No one-time goals yet. Add your first one-time goal above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOneTimeGoalDragEnd}>
                <SortableContext items={oneTimeGoalOrder} strategy={verticalListSortingStrategy}>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {/* Drag handle */}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Goal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {oneTimeGoalOrder.map(id => {
                        const goal = oneTimeGoals.find(g => g.id === id)
                        if (!goal) return null
                        return (
                          <SortableRow key={goal.id} id={goal.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"/>
                                </svg>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className={`text-sm font-medium ${
                                  goal.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {goal.title}
                                </div>
                                {goal.description && (
                                  <div className={`text-sm ${
                                    goal.isCompleted ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {goal.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative status-dropdown">
                                <button
                                  onClick={() => setStatusDropdownOpen(statusDropdownOpen === goal.id ? null : goal.id)}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(goal.status)}`}
                                >
                                  {getStatusText(goal.status)}
                                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                {statusDropdownOpen === goal.id && (
                                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 status-dropdown">
                                    <div className="py-1">
                                      {['not-started', 'in-progress', 'on-hold', 'completed', 'cancelled'].map((status) => (
                                        <button
                                          key={status}
                                          onClick={() => updateGoalStatus(goal.id, status)}
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
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleOneTimeGoal(goal.id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                  goal.isCompleted
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {goal.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(goal)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setDeletingGoal(goal.id)} variant="destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </SortableRow>
                        )
                      })}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* To-Do List Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">To-Do List</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your tasks and daily activities</p>
          </div>
          
          {/* Add Todo Form */}
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={addTodo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="todo-title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your task..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="todo-priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="todo-priority"
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="todo-dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="todo-dueDate"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="todo-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="todo-description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add details about this task..."
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Todos List */}
          {todosArray.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks yet. Add your first task above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTodoDragEnd}>
                <SortableContext items={todoOrder} strategy={verticalListSortingStrategy}>
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
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {todoOrder.map(id => {
                        const todo = activeTodos.find(t => t.id === id);
                        if (!todo) return null;
                        return (
                          <SortableRow key={todo.id} id={todo.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"/>
                                </svg>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className={`text-sm font-medium ${
                                  todo.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {todo.title}
                                </div>
                                {todo.description && (
                                  <div className={`text-sm ${
                                    todo.isCompleted ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    console.log('Edit clicked for todo:', todo);
                                    openTodoEditModal(todo);
                                  }}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    console.log('Delete clicked for todo:', todo.id);
                                    setDeletingTodo(todo.id);
                                  }} variant="destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </SortableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
              
              {/* Completed Todos Section */}
              {completedTodos.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCompletedTodos(!showCompletedTodos)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 mb-4"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${showCompletedTodos ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{showCompletedTodos ? 'Hide' : 'Show'} Completed Tasks ({completedTodos.length})</span>
                  </button>
                  
                  {showCompletedTodos && (
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
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Completed Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completedTodos.map((todo) => (
                          <tr key={todo.id} className="bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-500 line-through">
                                  {todo.title}
                                </div>
                                {todo.description && (
                                  <div className="text-sm text-gray-400">
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
                                {todo.dueDate ? formatDueDate(todo.dueDate) : 'No due date'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    console.log('Reopen clicked for todo:', todo.id);
                                    toggleTodoCompletion(todo.id, todo.isCompleted);
                                  }}>
                                    Reopen
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    console.log('Delete clicked for completed todo:', todo.id);
                                    setDeletingTodo(todo.id);
                                  }} variant="destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {todo.completedAt ? formatDueDate(todo.completedAt) : '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openTodoEditModal(todo)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeletingTodo(todo.id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Goal Modal */}
        {showEditModal && editingGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
              <form onSubmit={editGoal} className="space-y-4">
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
                {editingGoal.goalType === 'one-time' && (
                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="edit-status"
                      value={editingGoal.status || 'in-progress'}
                      onChange={(e) => setEditingGoal({ ...editingGoal, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingGoal(null)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Todo Modal */}
        {showTodoEditModal && editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
              <form onSubmit={editTodo} className="space-y-4">
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
                    onClick={() => {
                      setShowTodoEditModal(false)
                      setEditingTodo(null)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Goal Confirmation Modal */}
        {deletingGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Goal</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this goal? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => deleteGoal(deletingGoal)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingGoal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Todo Confirmation Modal */}
        {deletingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => deleteTodo(deletingTodo)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingTodo(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
