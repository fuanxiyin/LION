import Database from 'better-sqlite3';
import db from './index';
import { Patent } from '../data/models';

// 将数据库行转换为专利对象
const toPatent = (row: any): Patent => ({
  id: row.id,
  title: row.title,
  inventors: row.inventors,
  inventorIds: row.inventor_ids ? JSON.parse(row.inventor_ids) : undefined,
  patentNumber: row.patent_number,
  applicationDate: row.application_date,
  grantDate: row.grant_date,
  abstract: row.abstract,
  keywords: row.keywords ? JSON.parse(row.keywords) : [],
  status: row.status,
  type: row.type,
  pdfUrl: row.pdf_url,
  isHighlighted: Boolean(row.is_highlighted)
});

// 获取所有专利
export const getAllPatents = async (): Promise<Patent[]> => {
  const rows = await db.prepare('SELECT * FROM patents ORDER BY application_date DESC').all();
  return rows.map(toPatent);
};

// 根据ID获取专利
export const getPatentById = async (id: number): Promise<Patent | null> => {
  const row = await db.prepare('SELECT * FROM patents WHERE id = ?').get(id);
  return row ? toPatent(row) : null;
};

// 创建新专利
export const createPatent = async (patent: Omit<Patent, 'id'>): Promise<Patent> => {
  const result = await db.prepare(
    `INSERT INTO patents (
      title, inventors, inventor_ids, patent_number, application_date, grant_date,
      abstract, keywords, status, type, pdf_url, is_highlighted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    patent.title,
    patent.inventors,
    patent.inventorIds ? JSON.stringify(patent.inventorIds) : null,
    patent.patentNumber,
    patent.applicationDate,
    patent.grantDate,
    patent.abstract,
    JSON.stringify(patent.keywords || []),
    patent.status,
    patent.type,
    patent.pdfUrl,
    patent.isHighlighted ? 1 : 0
  );

  return {
    id: result.lastInsertRowid as number,
    ...patent
  };
};

// 更新专利
export const updatePatent = async (id: number, patent: Partial<Patent>): Promise<boolean> => {
  const existing = await getPatentById(id);
  if (!existing) return false;

  const updated = {
    ...existing,
    ...patent
  };

  const result = await db.prepare(
    `UPDATE patents SET
      title = ?,
      inventors = ?,
      inventor_ids = ?,
      patent_number = ?,
      application_date = ?,
      grant_date = ?,
      abstract = ?,
      keywords = ?,
      status = ?,
      type = ?,
      pdf_url = ?,
      is_highlighted = ?
    WHERE id = ?`
  ).run(
    updated.title,
    updated.inventors,
    updated.inventorIds ? JSON.stringify(updated.inventorIds) : null,
    updated.patentNumber,
    updated.applicationDate,
    updated.grantDate,
    updated.abstract,
    JSON.stringify(updated.keywords || []),
    updated.status,
    updated.type,
    updated.pdfUrl,
    updated.isHighlighted ? 1 : 0,
    id
  );

  return result.changes > 0;
};

// 删除专利
export const deletePatent = async (id: number): Promise<boolean> => {
  const result = await db.prepare('DELETE FROM patents WHERE id = ?').run(id);
  return result.changes > 0;
};

// 获取高亮专利
export const getHighlightedPatents = async (): Promise<Patent[]> => {
  const rows = await db.prepare('SELECT * FROM patents WHERE is_highlighted = 1 ORDER BY application_date DESC').all();
  return rows.map(toPatent);
};

// 搜索专利
export const searchPatents = async (query: string): Promise<Patent[]> => {
  const searchTerm = `%${query}%`;
  const rows = await db.prepare(
    `SELECT * FROM patents 
    WHERE title LIKE ? 
    OR inventors LIKE ? 
    OR patent_number LIKE ? 
    OR abstract LIKE ?
    ORDER BY application_date DESC`
  ).all(searchTerm, searchTerm, searchTerm, searchTerm);
  return rows.map(toPatent);
}; 