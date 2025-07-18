'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'

// Import components
import { GoalForm } from '@/components/GoalForm'
import { TodoSection } from '@/components/TodoSection'
import { GoalSection } from '@/components/GoalSection'
import { EditGoalModal } from '@/components/modals/EditGoalModal'
import { EditTodoModal } from '@/components/modals/EditTodoModal'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'
import { BackgroundMovingCards } from '@/components/ui/background-moving-cards'

// Import types
import { Goal, Todo } from '@/components/types'

// Fight Club quotes for background
const fightClubQuotes = [
  {
    quote:
      "The first rule of Fight Club is: you do not talk about Fight Club. The second rule of Fight Club is: you DO NOT talk about Fight Club!",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "We buy things we don't need with money we don't have to impress people we don't like.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "Maybe self-improvement isn't the answer, maybe self-destruction is the answer.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "I am Jack's complete lack of surprise. I am Jack's smirking revenge.",
    name: "Narrator",
    title: "Fight Club",
  },
  {
    quote:
      "The things you own end up owning you. It's only after you've lost everything that you're free to do anything.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "This is your life and it's ending one minute at a time.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "You are not your job, you're not how much money you have in the bank. You are not the car you drive. You're not the contents of your wallet.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "I wanted to destroy everything beautiful I'd never have.",
    name: "Narrator",
    title: "Fight Club",
  },
  {
    quote:
      "We've all been raised on television to believe that one day we'd all be millionaires, and movie gods, and rock stars. But we won't. And we're slowly learning that fact. And we're very, very pissed off.",
    name: "Tyler Durden",
    title: "Fight Club",
  },
  {
    quote:
      "I am Jack's broken heart. I am Jack's wasted life. I am Jack's complete lack of surprise.",
    name: "Narrator",
    title: "Fight Club",
  },
];

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

  // Computed values
  const dailyGoals = useMemo(() => goals.filter(goal => goal.goalType === 'daily'), [goals])
  const oneTimeGoals = useMemo(() => goals.filter(goal => goal.goalType === 'one-time'), [goals])

  // Effects
  useEffect(() => {
    fetchGoals()
    fetchTodos()
  }, [])

  // API Functions
  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
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
      toast.error('Failed to load todos')
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
        toast.success(`${goalData.goalType === 'daily' ? 'Daily goal' : 'One-time goal'} created successfully!`)
        fetchGoals()
      } else {
        toast.error('Failed to create goal')
      }
    } catch (error) {
      console.error('Error adding goal:', error)
      toast.error('Failed to create goal')
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
        toast.success('Task created successfully!')
        fetchTodos()
      } else {
        toast.error('Failed to create task')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      toast.error('Failed to create task')
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
        toast.success('Goal updated successfully!')
        setShowEditModal(false)
        setEditingGoal(null)
        fetchGoals()
      } else {
        toast.error('Failed to update goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal')
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
        toast.success('Task updated successfully!')
        setShowTodoEditModal(false)
        setEditingTodo(null)
        fetchTodos()
      } else {
        toast.error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      toast.error('Failed to update task')
    }
  }

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Goal deleted successfully!')
        setDeletingGoal(null)
        fetchGoals()
      } else {
        toast.error('Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
    }
  }

  const deleteTodo = async (todoId: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Task deleted successfully!')
        setDeletingTodo(null)
        fetchTodos()
      } else {
        toast.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Failed to delete task')
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
        toast.success(isCompleted ? 'Task reopened!' : 'Task completed!')
        fetchTodos()
      } else {
        toast.error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      toast.error('Failed to update task status')
    }
  }

  const updateTodoPriority = async (todoId: string, priority: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      })

      if (response.ok) {
        toast.success('Task priority updated!')
        fetchTodos()
      } else {
        toast.error('Failed to update task priority')
      }
    } catch (error) {
      console.error('Error updating todo priority:', error)
      toast.error('Failed to update task priority')
    }
  }

  const toggleCompletion = async (goalId: string) => {
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
        toast.success('Daily goal marked as incomplete')
      } else {
        await fetch(`/api/goals/${goalId}/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: today }),
        })
        toast.success('Daily goal completed!')
      }
      fetchGoals()
    } catch (error) {
      console.error('Error toggling completion:', error)
      toast.error('Failed to update goal status')
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
      toast.success('One-time goal status updated!')
      fetchGoals()
    } catch (error) {
      console.error('Error toggling one-time goal:', error)
      toast.error('Failed to update goal status')
    }
  }

  const updateGoalStatus = async (goalId: string, status: string) => {
    try {
      await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      toast.success('Goal status updated!')
      fetchGoals()
    } catch (error) {
      console.error('Error updating goal status:', error)
      toast.error('Failed to update goal status')
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
      toast.success('Goals reordered successfully!')
      fetchGoals()
    } catch (error) {
      console.error('Error reordering goals:', error)
      toast.error('Failed to reorder goals')
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background moving cards */}
      <BackgroundMovingCards
        items={fightClubQuotes}
        direction="left"
        speed="slow"
        pauseOnHover={false}
      />
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
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
          onStatusChange={updateGoalStatus}
          onEdit={openEditModal}
          onDelete={setDeletingGoal}
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
          onStatusChange={updateGoalStatus}
          onEdit={openEditModal}
          onDelete={setDeletingGoal}
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
          onPriorityChange={updateTodoPriority}
          onReorder={(reorderedTodos) => {
            setTodos(reorderedTodos)
            toast.success('Tasks reordered successfully!')
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
          onConfirm={async () => {
            if (deletingGoal) {
              await deleteGoal(deletingGoal)
            }
          }}
          onCancel={() => setDeletingGoal(null)}
        />

        <DeleteConfirmationModal
          isOpen={!!deletingTodo}
          itemType="todo"
          onConfirm={async () => {
            if (deletingTodo) {
              await deleteTodo(deletingTodo)
            }
          }}
          onCancel={() => setDeletingTodo(null)}
        />
      </div>
    </div>
  )
}
