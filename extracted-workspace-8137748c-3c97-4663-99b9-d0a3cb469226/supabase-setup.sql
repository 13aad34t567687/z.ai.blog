-- 创建博客表
CREATE TABLE IF NOT EXISTS blog (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  header TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON blog(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog(published);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tag (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签索引
CREATE INDEX IF NOT EXISTS idx_tag_slug ON tag(slug);
CREATE INDEX IF NOT EXISTS idx_tag_name ON tag(name);

-- 创建博客标签关联表
CREATE TABLE IF NOT EXISTS blog_tag (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id TEXT REFERENCES blog(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tag(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_id, tag_id)
);

-- 创建关联表索引
CREATE INDEX IF NOT EXISTS idx_blog_tag_blog_id ON blog_tag(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_tag_tag_id ON blog_tag(tag_id);

-- 插入示例数据
INSERT INTO blog (title, slug, content, summary, published) VALUES
('Next.js 15 新特性详解', 'nextjs-15-features', 'Next.js 15 带来了许多激动人心的新特性...', '深入了解 Next.js 15 带来的新特性', true),
('TypeScript 高级类型技巧', 'typescript-advanced-types', 'TypeScript 的类型系统非常强大...', '探索 TypeScript 中的高级类型系统', true),
('React 性能优化最佳实践', 'react-performance-optimization', 'React 应用的性能优化是每个开发者都需要关注的重要话题...', '深入探讨 React 应用的性能优化技巧', true)
ON CONFLICT (slug) DO NOTHING;

-- 创建示例标签
INSERT INTO tag (name, slug) VALUES
('Next.js', 'nextjs'),
('React', 'react'),
('TypeScript', 'typescript'),
('前端开发', 'frontend'),
('性能优化', 'performance'),
('类型系统', 'type-system')
ON CONFLICT (slug) DO NOTHING;

-- 创建博客标签关联
INSERT INTO blog_tag (blog_id, tag_id)
SELECT b.id, t.id
FROM blog b, tag t
WHERE b.slug = 'nextjs-15-features' AND t.slug IN ('nextjs', 'react', 'frontend')
ON CONFLICT (blog_id, tag_id) DO NOTHING;

INSERT INTO blog_tag (blog_id, tag_id)
SELECT b.id, t.id
FROM blog b, tag t
WHERE b.slug = 'typescript-advanced-types' AND t.slug IN ('typescript', 'type-system')
ON CONFLICT (blog_id, tag_id) DO NOTHING;

INSERT INTO blog_tag (blog_id, tag_id)
SELECT b.id, t.id
FROM blog b, tag t
WHERE b.slug = 'react-performance-optimization' AND t.slug IN ('react', 'performance', 'frontend')
ON CONFLICT (blog_id, tag_id) DO NOTHING;