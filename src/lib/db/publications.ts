import db from './index';
import { Publication } from '../data/models';

// 将数据库记录转换为Publication对象
function toPublication(record: any): Publication {
  return {
    id: record.id,
    title: record.title,
    authors: record.authors,
    journal: record.journal,
    year: record.year,
    volume: record.volume || undefined,
    issue: record.issue || undefined,
    pages: record.pages || undefined,
    doi: record.doi || undefined,
    abstract: record.abstract || undefined,
    pdfUrl: record.pdf_url || undefined,
    citationCount: record.citation_count || 0,
    isHighlighted: Boolean(record.is_highlighted)
  };
}

// 获取所有出版物
export function getAllPublications(): Publication[] {
  const stmt = db.prepare(`
    SELECT * FROM publications
    ORDER BY year DESC, title ASC
  `);
  
  const records = stmt.all();
  return records.map(toPublication);
}

// 获取单个出版物
export function getPublicationById(id: number): Publication | null {
  const stmt = db.prepare(`
    SELECT * FROM publications
    WHERE id = ?
  `);
  
  const record = stmt.get(id);
  return record ? toPublication(record) : null;
}

// 创建新出版物
export function createPublication(data: Omit<Publication, 'id'>): Publication {
  const stmt = db.prepare(`
    INSERT INTO publications
    (title, authors, journal, year, volume, issue, pages, doi, abstract, pdf_url, is_highlighted, citation_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.title,
    data.authors,
    data.journal,
    data.year,
    data.volume || null,
    data.issue || null,
    data.pages || null,
    data.doi || null,
    data.abstract || null,
    data.pdfUrl || null,
    data.isHighlighted ? 1 : 0,
    data.citationCount || 0
  );
  
  const id = info.lastInsertRowid as number;
  return { ...data, id };
}

// 更新出版物
export function updatePublication(id: number, data: Partial<Publication>): boolean {
  // 获取现有出版物数据
  const existingPublication = getPublicationById(id);
  if (!existingPublication) {
    return false;
  }
  
  // 合并现有数据和新数据
  const updatedPublication = { ...existingPublication, ...data };
  
  const stmt = db.prepare(`
    UPDATE publications
    SET title = ?, 
        authors = ?, 
        journal = ?, 
        year = ?, 
        volume = ?, 
        issue = ?, 
        pages = ?, 
        doi = ?, 
        abstract = ?, 
        pdf_url = ?, 
        is_highlighted = ?,
        citation_count = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(
    updatedPublication.title,
    updatedPublication.authors,
    updatedPublication.journal,
    updatedPublication.year,
    updatedPublication.volume || null,
    updatedPublication.issue || null,
    updatedPublication.pages || null,
    updatedPublication.doi || null,
    updatedPublication.abstract || null,
    updatedPublication.pdfUrl || null,
    updatedPublication.isHighlighted ? 1 : 0,
    updatedPublication.citationCount || 0,
    id
  );
  
  return result.changes > 0;
}

// 删除出版物
export function deletePublication(id: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM publications
    WHERE id = ?
  `);
  
  const result = stmt.run(id);
  return result.changes > 0;
}

// 获取高被引的出版物
export function getHighlightedPublications(): Publication[] {
  const stmt = db.prepare(`
    SELECT * FROM publications
    WHERE is_highlighted = 1
    ORDER BY year DESC, title ASC
  `);
  
  const records = stmt.all();
  return records.map(toPublication);
}

// 按年份获取出版物
export function getPublicationsByYear(year: number): Publication[] {
  const stmt = db.prepare(`
    SELECT * FROM publications
    WHERE year = ?
    ORDER BY title ASC
  `);
  
  const records = stmt.all(year);
  return records.map(toPublication);
} 