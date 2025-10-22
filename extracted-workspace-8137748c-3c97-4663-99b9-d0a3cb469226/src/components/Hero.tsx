import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto flex h-full items-center justify-center px-4">
        <div className="text-center text-white">
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/30" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            欢迎来到我的博客
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
            这里记录着我的技术思考、生活感悟和学习心得。希望我的分享能够给你带来启发和帮助。
          </p>

          {/* CTA Button */}
          <Link href="#blog-list">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              开始阅读
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}