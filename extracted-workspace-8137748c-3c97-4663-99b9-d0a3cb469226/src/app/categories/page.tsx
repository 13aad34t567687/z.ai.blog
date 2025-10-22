import TopNav from '@/components/TopNav'
import PublishBlogModal from '@/components/PublishBlogModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// 模拟分类数据
const categories = [
  {
    name: '前端开发',
    slug: 'frontend',
    description: '涵盖 HTML、CSS、JavaScript、React、Vue 等前端技术栈的文章',
    count: 15,
    color: 'bg-blue-500'
  },
  {
    name: '后端开发',
    slug: 'backend',
    description: 'Node.js、Python、数据库设计、API 开发等后端技术分享',
    count: 8,
    color: 'bg-green-500'
  },
  {
    name: '移动开发',
    slug: 'mobile',
    description: 'React Native、Flutter、原生 iOS/Android 开发经验总结',
    count: 6,
    color: 'bg-purple-500'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'Docker、Kubernetes、CI/CD、云服务等运维相关技术',
    count: 4,
    color: 'bg-orange-500'
  },
  {
    name: '人工智能',
    slug: 'ai',
    description: '机器学习、深度学习、自然语言处理等 AI 技术探索',
    count: 7,
    color: 'bg-red-500'
  },
  {
    name: '设计',
    slug: 'design',
    description: 'UI/UX 设计、用户体验、产品设计思维分享',
    count: 5,
    color: 'bg-pink-500'
  },
  {
    name: '工具效率',
    slug: 'tools',
    description: '开发工具、效率技巧、工作流程优化等实用分享',
    count: 9,
    color: 'bg-indigo-500'
  },
  {
    name: '思考感悟',
    slug: 'thoughts',
    description: '技术思考、职业发展、学习方法等个人感悟',
    count: 12,
    color: 'bg-gray-500'
  }
]

// 模拟热门标签
const popularTags = [
  { name: 'React', count: 8 },
  { name: 'TypeScript', count: 6 },
  { name: 'Next.js', count: 5 },
  { name: 'Node.js', count: 4 },
  { name: 'CSS', count: 4 },
  { name: 'JavaScript', count: 7 },
  { name: 'Vue.js', count: 3 },
  { name: 'Python', count: 3 },
  { name: 'Docker', count: 2 },
  { name: 'Git', count: 5 }
]

export default function CategoriesPage() {
  const handlePublishSuccess = () => {
    // 可以在这里添加发布成功后的逻辑，比如刷新页面
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                文章分类
              </h1>
              <p className="text-muted-foreground text-lg">
                按分类浏览文章，快速找到感兴趣的内容
              </p>
            </div>
            
            {/* Publish Button */}
            <PublishBlogModal 
              onPublishSuccess={handlePublishSuccess}
            />
          </div>

          {/* Categories Grid */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">分类目录</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link key={category.slug} href={`/categories/${category.slug}`}>
                  <Card className="transition-all hover:shadow-lg hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`h-3 w-3 rounded-full ${category.color}`} />
                        <Badge variant="secondary">{category.count} 篇文章</Badge>
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">热门标签</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  {popularTags.map((tag) => (
                    <Link key={tag.name} href={`/tags/${tag.name.toLowerCase()}`}>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tag.name} ({tag.count})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}