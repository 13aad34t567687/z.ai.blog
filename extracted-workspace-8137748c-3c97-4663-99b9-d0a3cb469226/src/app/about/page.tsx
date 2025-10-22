import TopNav from '@/components/TopNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Github, Twitter, Linkedin, BookOpen, Coffee, Heart } from 'lucide-react'

export default function AboutPage() {
  const skills = [
    { name: 'JavaScript/TypeScript', level: '精通' },
    { name: 'React/Next.js', level: '精通' },
    { name: 'Node.js', level: '熟练' },
    { name: 'Python', level: '熟练' },
    { name: 'Docker/DevOps', level: '了解' },
    { name: 'UI/UX Design', level: '了解' }
  ]

  const interests = [
    '前端技术探索',
    '开源项目贡献',
    '技术写作分享',
    '用户体验设计',
    '人工智能应用',
    '效率工具开发'
  ]

  const achievements = [
    {
      title: '技术博客',
      description: '累计发表 50+ 篇技术文章，总阅读量超过 10 万',
      icon: BookOpen
    },
    {
      title: '开源项目',
      description: '维护多个开源项目，获得 1000+ GitHub Stars',
      icon: Github
    },
    {
      title: '技术分享',
      description: '参与技术会议分享，帮助更多开发者成长',
      icon: Coffee
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 bg-gradient-to-br from-blue-400 to-purple-600">
                <div className="flex h-full w-full items-center justify-center text-white">
                  <div className="text-4xl font-bold">A</div>
                </div>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              关于我
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              一个热爱技术、喜欢分享的全栈开发者。专注于前端技术探索，
              致力于用技术改变世界，让生活更美好。
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Story Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    我的故事
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    你好！我是一名充满激情的全栈开发者，拥有 5 年的软件开发经验。
                    从最初接触 HTML/CSS 开始，我就被前端开发的魅力所吸引，
                    从此踏上了技术探索的旅程。
                  </p>
                  <p>
                    在这些年的开发经历中，我参与了各种规模的项目，
                    从初创公司的 MVP 到大型企业的复杂系统。
                    每一个项目都让我成长，让我对技术有了更深的理解。
                  </p>
                  <p>
                    我相信技术的力量，也相信分享的价值。通过写博客、参与开源、
                    技术分享，我希望能够帮助更多的开发者，共同推动技术社区的发展。
                  </p>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card>
                <CardHeader>
                  <CardTitle>技术栈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant={skill.level === '精通' ? 'default' : 'secondary'}>
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests Card */}
              <Card>
                <CardHeader>
                  <CardTitle>兴趣领域</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>联系方式</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">hello@example.com</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://github.com" target="_blank">
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://twitter.com" target="_blank">
                        <Twitter className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://linkedin.com" target="_blank">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>成就</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.title} className="flex gap-3">
                      <achievement.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 font-semibold">让我们一起交流</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    如果你对技术有热情，欢迎与我交流学习
                  </p>
                  <Button asChild>
                    <Link href="/contact">联系我</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}