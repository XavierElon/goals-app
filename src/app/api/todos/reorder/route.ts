import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { todoIds } = await request.json()

    if (!Array.isArray(todoIds)) {
      return NextResponse.json(
        { error: 'Todo IDs must be an array' },
        { status: 400 }
      )
    }

    // Update the order of todos by updating their createdAt timestamps
    const updates = todoIds.map((todoId: string, index: number) => {
      const newDate = new Date()
      newDate.setSeconds(newDate.getSeconds() - todoIds.length + index)
      
      return prisma.todo.update({
        where: { id: todoId },
        data: { createdAt: newDate }
      })
    })

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering todos:', error)
    return NextResponse.json(
      { error: 'Failed to reorder todos' },
      { status: 500 }
    )
  }
} 