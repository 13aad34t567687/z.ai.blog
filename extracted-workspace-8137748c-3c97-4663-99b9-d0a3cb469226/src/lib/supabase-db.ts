import { supabase, Blog, Tag, BlogTag, BlogWithTags } from './supabase'

export const blogService = {
  async getAll(page = 1, limit = 10, published = true, tag?: string) {
    let query = supabase
      .from('blog')
      .select(`*, blog_tag(tag!inner(name))`, { count: 'exact' })
      .eq('published', published)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (tag) {
      query = query.eq('blog_tag.tag.name', tag)
    }

    const { data, error, count } = await query
    if (error) throw error

    const blogs: BlogWithTags[] = data?.map(blog => ({
      ...blog,
      tags: blog.blog_tag?.map(bt => bt.tag.name) || []
    })) || []

    return {
      blogs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog')
      .select(`*, blog_tag(tag(name))`)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) throw error

    return {
      ...data,
      tags: data.blog_tag?.map(bt => bt.tag.name) || []
    } as BlogWithTags
  },

  async create(blogData: {
    title: string
    slug: string
    content: string
    summary?: string
    header?: string
    published?: boolean
    tags?: string[]
  }) {
    const { title, slug, content, summary, header, published = true, tags = [] } = blogData

    // Create blog
    const { data: blog, error: blogError } = await supabase
      .from('blog')
      .insert({ title, slug, content, summary, header, published })
      .select()
      .single()

    if (blogError) throw blogError

    // Create tags and associations
    if (tags.length > 0) {
      const tagPromises = tags.map(async tagName => {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        
        const { data: tag } = await supabase
          .from('tag')
          .upsert({ name: tagName, slug: tagSlug })
          .select()
          .single()

        return supabase
          .from('blog_tag')
          .insert({ blog_id: blog.id, tag_id: tag.id })
      })

      await Promise.all(tagPromises)
    }

    return await this.getBySlug(slug)
  },

  async update(slug: string, updateData: Partial<Blog>) {
    const { data, error } = await supabase
      .from('blog')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(slug: string) {
    const { error } = await supabase
      .from('blog')
      .delete()
      .eq('slug', slug)

    if (error) throw error
  }
}

export const tagService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tag')
      .select(`*, blog_tag(blog_id)`)
      .order('name')

    if (error) throw error

    return data?.map(tag => ({
      ...tag,
      blog_count: tag.blog_tag?.length || 0
    })) || []
  },

  async create(tagData: { name: string; slug: string }) {
    const { data, error } = await supabase
      .from('tag')
      .insert(tagData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}