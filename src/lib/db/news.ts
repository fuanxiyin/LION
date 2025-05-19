import db from './index';
import { News } from '../data/models';

// 将数据库记录转换为News对象
function toNews(record: any): News {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    publish_date: record.publish_date,
    author: record.author || '',
    isPublished: Boolean(record.is_published),
    imageUrl: record.image_url
  };
}

// 获取所有新闻
export function getAllNews(): News[] {
  const stmt = db.prepare(`
    SELECT * FROM news
    ORDER BY publish_date DESC
  `);
  
  const records = stmt.all();
  return records.map(toNews);
}

// 获取单个新闻
export function getNewsById(id: number): News | null {
  const stmt = db.prepare(`
    SELECT * FROM news
    WHERE id = ?
  `);
  
  const record = stmt.get(id);
  return record ? toNews(record) : null;
}

// 获取已发布的新闻
export function getPublishedNews(): News[] {
  const stmt = db.prepare(`
    SELECT * FROM news
    WHERE is_published = 1
    ORDER BY publish_date DESC
  `);
  
  const records = stmt.all();
  return records.map(toNews);
}

// 创建新闻
export function createNews(data: Omit<News, 'id'>): News {
  const stmt = db.prepare(`
    INSERT INTO news
    (title, content, publish_date, author, image_url, is_published)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.title,
    data.content,
    data.publish_date,
    data.author || null,
    data.imageUrl || null,
    data.isPublished ? 1 : 0
  );
  
  const id = info.lastInsertRowid as number;
  return { ...data, id };
}

// 更新新闻
export function updateNews(id: number, data: Partial<News>): boolean {
  // 获取现有新闻数据
  const existingNews = getNewsById(id);
  if (!existingNews) {
    return false;
  }
  
  // 合并现有数据和新数据
  const updatedNews = { ...existingNews, ...data };
  
  const stmt = db.prepare(`
    UPDATE news
    SET title = ?, 
        content = ?, 
        publish_date = ?, 
        author = ?, 
        image_url = ?, 
        is_published = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(
    updatedNews.title,
    updatedNews.content,
    updatedNews.publish_date,
    updatedNews.author || null,
    updatedNews.imageUrl || null,
    updatedNews.isPublished ? 1 : 0,
    id
  );
  
  return result.changes > 0;
}

// 删除新闻
export function deleteNews(id: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM news
    WHERE id = ?
  `);
  
  const result = stmt.run(id);
  return result.changes > 0;
} 