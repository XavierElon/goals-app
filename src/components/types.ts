export interface Goal {
  id: string
  title: string
  description?: string
  goalType: string
  isCompleted: boolean
  createdAt: string
  completions: Array<{
    id: string
    date: string
  }>
}

export interface Todo {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  completedAt?: string
  priority: string
  dueDate?: string
  createdAt: string
} 