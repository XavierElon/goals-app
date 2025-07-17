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
    const { title, description, goalType, status } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        goalType: goalType || 'daily',
        status: status || 'in-progress'
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