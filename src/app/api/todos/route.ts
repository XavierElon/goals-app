import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching todos from database...')
    console.log('Prisma client:', typeof prisma)
    console.log('Prisma todo model:', typeof prisma.todo)
    
    if (!prisma.todo) {
      console.error('Todo model is not available in Prisma client')
      return NextResponse.json(
        { error: 'Todo model not available' },
        { status: 500 }
      )
    }
    
    const todos = await prisma.todo.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    console.log(`Found ${todos.length} todos`)
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, priority, dueDate } = await request.json()

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

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        dueDate: parsedDueDate
      }
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
} 