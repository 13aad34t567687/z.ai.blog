import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BlogCardProps {
  id: string
  title: string
  summary: string
  header: string
  created_at: string
  tags: string[]
  slug: string
  reverse?: boolean
}

export default function BlogCard({
  id,
  title,
  summary,
  header,
  created_at,
  tags,
  slug,
  reverse = false
}: BlogCardProps) {
  // Simple date formatting
  const date = new Date(created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Generate placeholder image based on title
  const placeholderColors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-red-400 to-red-600'
  ]
  
  const colorIndex = title.length % placeholderColors.length
  const gradientClass = placeholderColors[colorIndex]

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Image Placeholder */}
        <div className="relative h-48 w-full md:h-auto md:w-1/3">
          <div className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <div className="text-white text-center p-4">
              <div className="text-2xl font-bold mb-2">{title.charAt(0)}</div>
              <div className="text-sm opacity-80">{title.substring(0, 20)}...</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <time>{date}</time>
            <span>•</span>
            <span>阅读时间 5 分钟</span>
          </div>

          <Link href={`/blog/${slug}`}>
            <h3 className="mb-3 text-xl font-semibold hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          <p className="mb-4 text-muted-foreground line-clamp-3">
            {summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}