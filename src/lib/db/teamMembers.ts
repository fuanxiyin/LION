import db from './index';
import { TeamMember } from '../data/models';

// 将数据库记录转换为TeamMember对象
function toTeamMember(record: any): TeamMember {
  return {
    id: record.id,
    name: record.name,
    title: record.title,
    degree: record.degree || undefined,
    research: record.research,
    email: record.email,
    category: record.category as 'professor' | 'associate' | 'postdoc' | 'student',
    googleScholar: record.google_scholar || undefined,
    researchGate: record.research_gate || undefined,
    orcid: record.orcid || undefined,
    bio: record.bio || undefined,
    photoUrl: record.photo_url || undefined,
    isActive: Boolean(record.is_active),
    joinDate: record.join_date
  };
}

// 获取所有团队成员
export function getAllTeamMembers(): TeamMember[] {
  const stmt = db.prepare(`
    SELECT * FROM team_members
    ORDER BY name ASC
  `);
  
  const records = stmt.all();
  return records.map(toTeamMember);
}

// 获取单个团队成员
export function getTeamMemberById(id: number): TeamMember | null {
  const stmt = db.prepare(`
    SELECT * FROM team_members
    WHERE id = ?
  `);
  
  const record = stmt.get(id);
  return record ? toTeamMember(record) : null;
}

// 创建新团队成员
export function createTeamMember(data: Omit<TeamMember, 'id'>): TeamMember {
  const stmt = db.prepare(`
    INSERT INTO team_members
    (name, title, degree, research, email, category, google_scholar, research_gate, orcid, bio, photo_url, is_active, join_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.name,
    data.title,
    data.degree || null,
    data.research,
    data.email,
    data.category,
    data.googleScholar || null,
    data.researchGate || null,
    data.orcid || null,
    data.bio || null,
    data.photoUrl || null,
    data.isActive ? 1 : 0,
    data.joinDate
  );
  
  const id = info.lastInsertRowid as number;
  return { ...data, id };
}

// 更新团队成员
export function updateTeamMember(id: number, data: Partial<TeamMember>): boolean {
  // 获取现有成员数据
  const existingMember = getTeamMemberById(id);
  if (!existingMember) {
    return false;
  }
  
  // 合并现有数据和新数据
  const updatedMember = { ...existingMember, ...data };
  
  const stmt = db.prepare(`
    UPDATE team_members
    SET name = ?, 
        title = ?, 
        degree = ?, 
        research = ?, 
        email = ?, 
        category = ?, 
        google_scholar = ?, 
        research_gate = ?, 
        orcid = ?, 
        bio = ?, 
        photo_url = ?, 
        is_active = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(
    updatedMember.name,
    updatedMember.title,
    updatedMember.degree || null,
    updatedMember.research,
    updatedMember.email,
    updatedMember.category,
    updatedMember.googleScholar || null,
    updatedMember.researchGate || null,
    updatedMember.orcid || null,
    updatedMember.bio || null,
    updatedMember.photoUrl || null,
    updatedMember.isActive ? 1 : 0,
    id
  );
  
  return result.changes > 0;
}

// 删除团队成员
export function deleteTeamMember(id: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM team_members
    WHERE id = ?
  `);
  
  const result = stmt.run(id);
  return result.changes > 0;
}

// 按类别获取团队成员
export function getTeamMembersByCategory(category: string): TeamMember[] {
  const stmt = db.prepare(`
    SELECT * FROM team_members
    WHERE category = ?
    ORDER BY name ASC
  `);
  
  const records = stmt.all(category);
  return records.map(toTeamMember);
}

// 搜索团队成员
export function searchTeamMembers(query: string): TeamMember[] {
  const stmt = db.prepare(`
    SELECT * FROM team_members
    WHERE name LIKE ? OR title LIKE ? OR research LIKE ? OR email LIKE ?
    ORDER BY name ASC
  `);
  
  const searchPattern = `%${query}%`;
  const records = stmt.all(searchPattern, searchPattern, searchPattern, searchPattern);
  return records.map(toTeamMember);
} 