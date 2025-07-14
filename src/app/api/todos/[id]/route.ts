import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: todoId } = await params
    const { title, description, priority, dueDate, isCompleted } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Handle date conversion to prevent timezone issues
    let parsedDueDate = null
    if (dueDate) {
      // Create date in local timezone by adding time component
      const [year, month, day] = dueDate.split('-').map(Number)
      parsedDueDate = new Date(year, month - 1, day, 12, 0, 0) // Use noon to avoid timezone issues
    }

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title,
        description,
        priority: priority || 'medium',
        dueDate: parsedDueDate,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined
      }
    })

    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: todoId } = await params

    await prisma.todo.delete({
      where: { id: todoId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
} 