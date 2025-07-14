import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { date } = await request.json()
    const goalId = params.id

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

    // Create completion for the specified date (or today if not provided)
    const completionDate = date ? new Date(date) : new Date()
    
    const completion = await prisma.goalCompletion.create({
      data: {
        goalId,
        date: completionDate
      }
    })

    return NextResponse.json(completion, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Completion already exists for this date' },
        { status: 409 }
      )
    }
    
    console.error('Error creating completion:', error)
    return NextResponse.json(
      { error: 'Failed to create completion' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { date } = await request.json()
    const goalId = params.id

    const completionDate = date ? new Date(date) : new Date()
    
    await prisma.goalCompletion.deleteMany({
      where: {
        goalId,
        date: {
          gte: new Date(completionDate.getFullYear(), completionDate.getMonth(), completionDate.getDate()),
          lt: new Date(completionDate.getFullYear(), completionDate.getMonth(), completionDate.getDate() + 1)
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting completion:', error)
    return NextResponse.json(
      { error: 'Failed to delete completion' },
      { status: 500 }
    )
  }
} 