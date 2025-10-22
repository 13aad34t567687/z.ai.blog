'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'
import PublishBlogModal from '@/components/PublishBlogModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

interface Blog {
  id: string
  title: string
  content: string
  summary: string
  header: string
  created_at: string
  updated_at: string
  published: boolean
  tags: string[]
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`)
      if (!response.ok) {
        setError(response.status === 404 ? '文章未找到' : '加载文章失败')
        return
      }
      const data = await response.json()
      setBlog(data)
    } catch (error) {
      console.error('Error fetching blog:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-2xl font-bold">出错了</h1>
            <p className="text-muted-foreground mb-6">{error || '文章未找到'}</p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回首页
                </Button>
              </Link>
              <PublishBlogModal 
                onPublishSuccess={() => router.refresh()}
                trigger={<Button variant="outline">发布新文章</Button>}
              />
            </div>
          </div>
        </main>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
            <PublishBlogModal onPublishSuccess={() => router.refresh()} />
          </div>

          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">{blog.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time>{formatDate(blog.created_at)}</time>
                </div>
                {blog.updated_at !== blog.created_at && (
                  <div className="text-sm">更新于 {formatDate(blog.updated_at)}</div>
                )}
              </div>

              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {blog.summary && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">{blog.summary}</p>
                  </CardContent>
                </Card>
              )}
            </header>

            <div className="prose prose-gray max-w-none">
              <div className="bg-card rounded-lg p-8 border">
                <div className="whitespace-pre-wrap leading-relaxed">{blog.content}</div>
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t text-center">
              <p className="text-muted-foreground mb-4">
                感谢阅读！如果您觉得这篇文章有帮助，欢迎分享给更多朋友。
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回首页
                  </Button>
                </Link>
                <PublishBlogModal 
                  onPublishSuccess={() => router.refresh()}
                  trigger={<Button>发布新文章</Button>}
                />
              </div>
            </footer>
          </article>
        </div>
      </main>
    </div>
  )
}