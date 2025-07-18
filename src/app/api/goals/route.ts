import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Goal } from '@prisma/client'

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        completions: {
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: [
        { goalType: 'asc' },
        { order: 'asc' }
      ]
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, goalType, status, targetDate } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Handle date conversion to prevent timezone issues
    let parsedTargetDate = null
    if (targetDate && targetDate.trim() !== '') {
      // Create date in local timezone by adding time component
      const dateParts = targetDate.split('-').map(Number)
      if (dateParts.length === 3 && !dateParts.some(isNaN)) {
        const [year, month, day] = dateParts
        parsedTargetDate = new Date(year, month - 1, day, 12, 0, 0) // Use noon to avoid timezone issues
      }
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        goalType: goalType || 'daily',
        status: status || 'in-progress',
        targetDate: parsedTargetDate
      }
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
} 