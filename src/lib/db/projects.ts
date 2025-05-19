import db from './index';
import { Project } from '../data/models';

// 将数据库记录转换为Project对象
function toProject(record: any): Project {
  return {
    id: record.id,
    name: record.title,
    source: record.funding_source || '',
    fundingAmount: record.funding_amount,
    startDate: record.start_date,
    endDate: record.end_date || '',
    leader: record.leader || '',
    description: record.description,
    isActive: Boolean(record.is_active)
  };
}

// 获取所有项目
export function getAllProjects(): Project[] {
  const stmt = db.prepare(`
    SELECT * FROM projects
    ORDER BY start_date DESC
  `);
  
  const records = stmt.all();
  return records.map(toProject);
}

// 获取单个项目
export function getProjectById(id: number): Project | null {
  const stmt = db.prepare(`
    SELECT * FROM projects
    WHERE id = ?
  `);
  
  const record = stmt.get(id);
  return record ? toProject(record) : null;
}

// 获取活跃项目
export function getActiveProjects(): Project[] {
  const stmt = db.prepare(`
    SELECT * FROM projects
    WHERE is_active = 1
    ORDER BY start_date DESC
  `);
  
  const records = stmt.all();
  return records.map(toProject);
}

// 按状态获取项目
export function getProjectsByStatus(isActive: boolean): Project[] {
  const stmt = db.prepare(`
    SELECT * FROM projects
    WHERE is_active = ?
    ORDER BY start_date DESC
  `);
  
  const records = stmt.all(isActive ? 1 : 0);
  return records.map(toProject);
}

// 搜索项目
export function searchProjects(query: string): Project[] {
  const stmt = db.prepare(`
    SELECT * FROM projects
    WHERE title LIKE ? OR description LIKE ? OR funding_source LIKE ? OR leader LIKE ?
    ORDER BY start_date DESC
  `);
  
  const searchPattern = `%${query}%`;
  const records = stmt.all(searchPattern, searchPattern, searchPattern, searchPattern);
  return records.map(toProject);
}

// 创建新项目
export function createProject(data: Omit<Project, 'id'>): Project {
  const stmt = db.prepare(`
    INSERT INTO projects
    (title, description, start_date, end_date, funding_source, funding_amount, leader, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.name,
    data.description || '',
    data.startDate,
    data.endDate || null,
    data.source || null,
    data.fundingAmount || null,
    data.leader || '',
    data.isActive ? 1 : 0
  );
  
  const id = info.lastInsertRowid as number;
  return { ...data, id };
}

// 更新项目
export function updateProject(id: number, data: Partial<Project>): boolean {
  // 获取现有项目数据
  const existingProject = getProjectById(id);
  if (!existingProject) {
    return false;
  }
  
  // 合并现有数据和新数据
  const updatedProject = { ...existingProject, ...data };
  
  const stmt = db.prepare(`
    UPDATE projects
    SET title = ?, 
        description = ?, 
        start_date = ?, 
        end_date = ?, 
        funding_source = ?, 
        funding_amount = ?, 
        leader = ?,
        is_active = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(
    updatedProject.name,
    updatedProject.description || '',
    updatedProject.startDate,
    updatedProject.endDate || null,
    updatedProject.source || null,
    updatedProject.fundingAmount || null,
    updatedProject.leader || '',
    updatedProject.isActive ? 1 : 0,
    id
  );
  
  return result.changes > 0;
}

// 删除项目
export function deleteProject(id: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM projects
    WHERE id = ?
  `);
  
  const result = stmt.run(id);
  return result.changes > 0;
} 