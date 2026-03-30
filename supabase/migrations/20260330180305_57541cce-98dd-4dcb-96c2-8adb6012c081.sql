UPDATE blog_posts SET 
  content = REPLACE(content, '—', ' - '),
  title = REPLACE(title, '—', ' - '),
  excerpt = REPLACE(excerpt, '—', ' - ')
WHERE content LIKE '%—%' OR title LIKE '%—%' OR excerpt LIKE '%—%';