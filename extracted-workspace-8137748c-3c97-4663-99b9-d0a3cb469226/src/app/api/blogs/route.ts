import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/supabase-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published') !== 'false'
    const tag = searchParams.get('tag')

    const result = await blogService.getAll(page, limit, published, tag)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, summary, header, tags = [], published = true } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    // Check if slug exists
    try {
      await blogService.getBySlug(slug)
      return NextResponse.json({ error: 'Blog with this slug already exists' }, { status: 409 })
    } catch {
      // Blog doesn't exist, continue
    }

    const blog = await blogService.create({ title, slug, content, summary, header, published, tags })
    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}