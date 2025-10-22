# 博客网站数据库设计文档

## 概述
本文档定义了博客网站的数据库表结构，包含博客文章和标签两个主要实体。

## 表结构设计

### 1. 博客表 (blog)

存储博客文章的基本信息。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| title | VARCHAR(255) | NOT NULL | 文章标题 |
| slug | VARCHAR(255) | UNIQUE NOT NULL | URL友好的文章标识符 |
| content | TEXT | NOT NULL | 文章内容（Markdown格式） |
| summary | TEXT | | 文章摘要 |
| header | VARCHAR(500) | | 文章头图URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |
| published | BOOLEAN | DEFAULT true | 是否发布 |

### 2. 标签表 (tag)

存储文章标签信息。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| name | VARCHAR(100) | UNIQUE NOT NULL | 标签名称 |
| slug | VARCHAR(100) | UNIQUE NOT NULL | URL友好的标签标识符 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3. 博客标签关联表 (blog_tag)

建立博客文章和标签的多对多关系。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | SERIAL | PRIMARY KEY | 自增主键 |
| blog_id | INTEGER | FOREIGN KEY REFERENCES blog(id) ON DELETE CASCADE | 博客文章ID |
| tag_id | INTEGER | FOREIGN KEY REFERENCES tag(id) ON DELETE CASCADE | 标签ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 索引设计

### blog表索引
- `idx_blog_slug` - slug字段唯一索引
- `idx_blog_created_at` - created_at字段索引（用于排序）
- `idx_blog_published` - published字段索引（用于过滤已发布文章）

### tag表索引
- `idx_tag_slug` - slug字段唯一索引
- `idx_tag_name` - name字段唯一索引

### blog_tag表索引
- `idx_blog_tag_blog_id` - blog_id字段索引
- `idx_blog_tag_tag_id` - tag_id字段索引
- `idx_blog_tag_unique` - blog_id和tag_id联合唯一索引

## 数据类型说明

### PostgreSQL数据类型
- `SERIAL`: 自增整数类型
- `VARCHAR(n)`: 可变长度字符串，最大长度n
- `TEXT`: 无长度限制的文本类型
- `TIMESTAMP`: 时间戳类型
- `BOOLEAN`: 布尔类型

## 约束说明

### 主键约束
- 每个表都有自增主键id

### 外键约束
- blog_tag.blog_id 引用 blog.id，级联删除
- blog_tag.tag_id 引用 tag.id，级联删除

### 唯一约束
- blog.slug 唯一，确保URL标识符不重复
- tag.name 和 tag.slug 唯一，确保标签不重复
- blog_tag.blog_id 和 blog_tag.tag_id 联合唯一，防止重复关联

### 非空约束
- blog.title, blog.slug, blog.content 不能为空
- tag.name, tag.slug 不能为空

## 默认值设置

### 时间戳
- created_at 默认为当前时间
- updated_at 默认为当前时间，更新时自动刷新

### 布尔值
- blog.published 默认为true，表示新创建的文章默认发布

## SQL创建语句示例

```sql
-- 创建博客表
CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    header VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT true
);

-- 创建标签表
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建博客标签关联表
CREATE TABLE blog_tag (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blog(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tag(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id, tag_id)
);

-- 创建索引
CREATE INDEX idx_blog_slug ON blog(slug);
CREATE INDEX idx_blog_created_at ON blog(created_at);
CREATE INDEX idx_blog_published ON blog(published);
CREATE INDEX idx_tag_slug ON tag(slug);
CREATE INDEX idx_tag_name ON tag(name);
CREATE INDEX idx_blog_tag_blog_id ON blog_tag(blog_id);
CREATE INDEX idx_blog_tag_tag_id ON blog_tag(tag_id);
```

## 使用说明

1. **博客文章管理**: 通过blog表进行CRUD操作
2. **标签管理**: 通过tag表管理标签
3. **关联查询**: 通过blog_tag表建立文章和标签的多对多关系
4. **排序**: 使用created_at字段进行时间排序
5. **过滤**: 使用published字段过滤已发布文章

## 注意事项

1. slug字段用于生成URL友好的标识符，建议使用标题的拼音或英文翻译
2. content字段存储Markdown格式的内容，前端需要相应的渲染组件
3. header字段存储文章头图URL，可以是相对路径或绝对路径
4. 更新文章时，updated_at字段会自动更新（需要触发器支持）