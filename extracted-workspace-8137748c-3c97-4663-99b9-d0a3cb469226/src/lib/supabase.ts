import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  header?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogTag {
  id: string
  blog_id: string
  tag_id: string
  created_at: string
}

// Blog with tags
export interface BlogWithTags extends Blog {
  tags: string[]
}