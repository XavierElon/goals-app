export const getPriorityColor = (priority: string) => {
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

export const getPriorityText = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export const formatDueDate = (dueDate: string) => {
  if (!dueDate) return null
  const date = new Date(dueDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatCompletionDate = (completedAt: string) => {
  if (!completedAt) return null
  const date = new Date(completedAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const isOverdue = (dueDate: string, isCompleted: boolean) => {
  if (!dueDate || isCompleted) return false
  return new Date(dueDate) < new Date()
}

export const getStreakCount = (completions: Array<{ date: string }>) => {
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

export const isCompletedToday = (completions: Array<{ date: string }>) => {
  const today = new Date().toISOString().split('T')[0]
  return completions.some(c => c.date.startsWith(today))
} 