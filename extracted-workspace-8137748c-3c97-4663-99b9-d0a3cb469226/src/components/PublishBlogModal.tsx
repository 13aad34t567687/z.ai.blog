'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface PublishBlogModalProps {
  onPublishSuccess?: () => void
  trigger?: React.ReactNode
}

export default function PublishBlogModal({ onPublishSuccess, trigger }: PublishBlogModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    tags: [] as string[],
    published: true
  })
  const [tagInput, setTagInput] = useState('')

  const generateSlug = (title: string) => {
    // 处理中文标题：如果是中文，则进行拼音转换或使用数字ID
    const hasChinese = /[\u4e00-\u9fa5]/.test(title)
    
    if (hasChinese) {
      // 对于中文标题，使用时间戳 + 简化的英文翻译
      const timestamp = Date.now().toString().slice(-6)
      const englishMap: { [key: string]: string } = {
        '指南': 'guide',
        '教程': 'tutorial',
        '技巧': 'tips',
        '最佳实践': 'best-practices',
        '详解': 'detailed',
        '介绍': 'introduction',
        '如何': 'how-to',
        '什么': 'what',
        '为什么': 'why',
        '使用': 'using',
        '开发': 'development',
        '设计': 'design',
        '优化': 'optimization',
        '配置': 'configuration',
        '部署': 'deployment',
        '测试': 'testing',
        '性能': 'performance',
        '安全': 'security',
        '管理': 'management',
        '实现': 'implementation',
        'React': 'react',
        'Vue': 'vue',
        'Angular': 'angular',
        'JavaScript': 'javascript',
        'TypeScript': 'typescript',
        'Next.js': 'nextjs',
        'Node.js': 'nodejs',
        'CSS': 'css',
        'HTML': 'html',
        'API': 'api',
        '数据库': 'database',
        '前端': 'frontend',
        '后端': 'backend',
        '全栈': 'fullstack',
        '框架': 'framework',
        '库': 'library',
        '工具': 'tools',
        '方法': 'method',
        '解决方案': 'solution',
        '问题': 'problem',
        '错误': 'error',
        '修复': 'fix',
        '更新': 'update',
        '版本': 'version',
        '新特性': 'new-features',
        '入门': 'getting-started',
        '基础': 'basics',
        '高级': 'advanced'
      }
      
      let slug = title
      // 尝试替换常见的中文词汇和技术术语
      Object.entries(englishMap).forEach(([chinese, english]) => {
        slug = slug.replace(new RegExp(chinese, 'g'), english)
      })
      
      // 如果还有中文字符，使用通用标识符
      if (/[\u4e00-\u9fa5]/.test(slug)) {
        slug = `article-${timestamp}`
      } else {
        slug = slug.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
        slug = `${slug}-${timestamp}`
      }
      
      return slug
    } else {
      // 英文标题直接处理
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value)
    })
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Reset form
        setFormData({
          title: '',
          slug: '',
          content: '',
          summary: '',
          tags: [],
          published: true
        })
        setTagInput('')
        setOpen(false)
        
        // Notify parent component
        if (onPublishSuccess) {
          onPublishSuccess()
        }
      } else {
        const error = await response.json()
        console.error('Error publishing blog:', error)
      }
    } catch (error) {
      console.error('Error publishing blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      发布文章
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>发布新文章</DialogTitle>
          <DialogDescription>
            分享您的想法和见解，发布一篇新的博客文章。
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                文章标题 *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="输入文章标题..."
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">
                URL 标识符 *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="url-slug"
                required
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                🤖 根据标题自动生成，也可手动修改
              </p>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium mb-2">
                文章摘要
              </label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="简要描述文章内容..."
                rows={3}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                文章内容 *
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="开始写作您的文章内容..."
                rows={12}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                支持 Markdown 格式
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                标签
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="输入标签后按回车添加..."
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  添加
                </Button>
              </div>
              
              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim() || !formData.content.trim()}>
              {loading ? '发布中...' : '发布文章'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}