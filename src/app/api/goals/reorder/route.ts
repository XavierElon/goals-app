import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { goalIds } = await request.json()

    if (!Array.isArray(goalIds)) {
      return NextResponse.json(
        { error: 'Goal IDs must be an array' },
        { status: 400 }
      )
    }

    // Update the order of goals by updating their createdAt timestamps
    // This is a simple approach - in a production app you might want a dedicated order field
    const updates = goalIds.map((goalId: string, index: number) => {
      const newDate = new Date()
      newDate.setSeconds(newDate.getSeconds() - goalIds.length + index)
      
      return prisma.goal.update({
        where: { id: goalId },
        data: { createdAt: newDate }
      })
    })

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering goals:', error)
    return NextResponse.json(
      { error: 'Failed to reorder goals' },
      { status: 500 }
    )
  }
} 