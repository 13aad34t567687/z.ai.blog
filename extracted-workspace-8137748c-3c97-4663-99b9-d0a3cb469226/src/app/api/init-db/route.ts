import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Test connection by trying to select from blog table
    const { data, error } = await supabase
      .from('blog')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Connection test error:', error)
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Database connection successful',
      data: data
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error },
      { status: 500 }
    )
  }
}