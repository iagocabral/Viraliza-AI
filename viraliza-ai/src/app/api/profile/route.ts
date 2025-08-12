import { NextResponse } from 'next/server'

// Mock profile data for testing
const mockProfile = {
  generation_count: 3,
  subscription_status: 'free'
}

export async function GET() {
  try {
    // Mock authentication - always return mock profile for testing
    return NextResponse.json(mockProfile)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}