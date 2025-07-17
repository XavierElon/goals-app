import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params
    const { title, description, goalType, status, order } = await request.json()

    // If this is a status update, we don't need title validation
    if (!title && !status && order === undefined) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const updateData: {
      title?: string
      description?: string | null
      goalType?: string
      status?: string
      order?: number
    } = {}
    
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (goalType) updateData.goalType = goalType
    if (status) updateData.status = status
    if (order !== undefined) updateData.order = order

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goalId } = await params

    // Delete the goal (completions will be deleted automatically due to cascade)
    await prisma.goal.delete({
      where: { id: goalId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
} 