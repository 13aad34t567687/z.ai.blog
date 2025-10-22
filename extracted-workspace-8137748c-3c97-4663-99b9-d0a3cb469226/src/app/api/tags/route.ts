import { NextRequest, NextResponse } from 'next/server'
import { tagService } from '@/lib/supabase-db'

export async function GET(request: NextRequest) {
  try {
    const tags = await tagService.getAll()

    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at,
      blog_count: tag.blog_count
    }))

    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const tag = await tagService.create({ name, slug })

    const formattedTag = {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      created_at: tag.created_at
    }

    return NextResponse.json(formattedTag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}