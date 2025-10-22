'use client'

import { useState, useEffect } from 'react'
import TopNav from '@/components/TopNav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  summary: string
  created_at: string
  tags: string[]
}

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    tags: '',
    published: true
  })

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

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags
        })
      })

      if (response.ok) {
        setFormData({
          title: '',
          slug: '',
          content: '',
          summary: '',
          tags: '',
          published: true
        })
        setShowForm(false)
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">博客管理</h1>
              <p className="text-muted-foreground">管理您的博客文章</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              新建文章
            </Button>
          </div>

          {/* New Blog Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>创建新文章</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">标题</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="文章标题"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">URL标识符</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="url-slug"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">摘要</label>
                    <Textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      placeholder="文章摘要"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">内容</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="文章内容（支持Markdown）"
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">标签</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="标签1, 标签2, 标签3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">发布文章</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      取消
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Blog List */}
          <div className="space-y-4">
            {blogs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">暂无文章，点击上方按钮创建第一篇文章！</p>
                </CardContent>
              </Card>
            ) : (
              blogs.map((blog) => (
                <Card key={blog.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {blog.summary}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(blog.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/blog/${blog.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}