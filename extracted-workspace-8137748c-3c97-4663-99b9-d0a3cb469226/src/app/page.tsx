'use client'

import { useState, useEffect } from 'react'
import TopNav from '@/components/TopNav'
import Hero from '@/components/Hero'
import BlogCard from '@/components/BlogCard'
import PublishBlogModal from '@/components/PublishBlogModal'

interface Blog {
  id: string
  title: string
  summary: string
  header: string
  created_at: string
  tags: string[]
  slug: string
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main>
        <Hero />

        <section id="blog-list" className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  最新文章
                </h2>
                <p className="text-muted-foreground text-lg">
                  探索技术世界，分享学习心得
                </p>
              </div>
              
              <PublishBlogModal onPublishSuccess={fetchBlogs} />
            </div>

            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">加载中...</div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">暂无文章，成为第一个发布者吧！</div>
                  <PublishBlogModal onPublishSuccess={fetchBlogs} />
                </div>
              ) : (
                blogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    {...blog}
                    reverse={index % 2 === 1}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}