import { supabase } from './supabase'

// Initialize Supabase tables
export async function initializeSupabaseTables() {
  try {
    // Create blog table
    const { error: blogError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
        CREATE INDEX IF NOT EXISTS idx_blog_created_at ON blog(created_at);
        CREATE INDEX IF NOT EXISTS idx_blog_published ON blog(published);
      `
    })

    if (blogError) {
      console.error('Error creating blog table:', blogError)
    }

    // Create tag table
    const { error: tagError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tag (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_tag_slug ON tag(slug);
        CREATE INDEX IF NOT EXISTS idx_tag_name ON tag(name);
      `
    })

    if (tagError) {
      console.error('Error creating tag table:', tagError)
    }

    // Create blog_tag table
    const { error: blogTagError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_tag (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          blog_id TEXT REFERENCES blog(id) ON DELETE CASCADE,
          tag_id TEXT REFERENCES tag(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(blog_id, tag_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_blog_tag_blog_id ON blog_tag(blog_id);
        CREATE INDEX IF NOT EXISTS idx_blog_tag_tag_id ON blog_tag(tag_id);
      `
    })

    if (blogTagError) {
      console.error('Error creating blog_tag table:', blogTagError)
    }

    console.log('Supabase tables initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing Supabase tables:', error)
    return false
  }
}

// Alternative approach using direct SQL
export async function createTablesManually() {
  try {
    // Create blog table
    const { error: blogError } = await supabase
      .from('blog')
      .select('id')
      .limit(1)

    if (blogError && blogError.code === 'PGRST116') {
      // Table doesn't exist, we need to create it manually
      console.log('Blog table does not exist. Please create tables manually in Supabase dashboard.')
      return false
    }

    console.log('Tables already exist')
    return true
  } catch (error) {
    console.error('Error checking tables:', error)
    return false
  }
}