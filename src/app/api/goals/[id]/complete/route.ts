import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params

    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    if (goal.goalType !== 'one-time') {
      return NextResponse.json(
        { error: 'This goal is not a one-time goal' },
        { status: 400 }
      )
    }

    // Toggle completion status
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        isCompleted: !goal.isCompleted,
        completedAt: !goal.isCompleted ? new Date() : null
      }
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Error updating goal completion:', error)
    return NextResponse.json(
      { error: 'Failed to update goal completion' },
      { status: 500 }
    )
  }
} 