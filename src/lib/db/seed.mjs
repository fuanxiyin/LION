import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';

// 解决ESM中的__dirname问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 导入初始化数据
import { teamMembers, publications, projects, news, users, todoItems, patents } from '../data/database.mjs';

// 创建数据库连接
const dbPath = join(process.cwd(), 'data', 'app.db');
// 删除已有数据库文件，避免表结构冲突
try {
  if (fs.existsSync(dbPath)) {
    console.log('删除现有数据库文件...');
    fs.unlinkSync(dbPath);
  }
} catch (error) {
  console.warn('无法删除现有数据库文件：', error);
}

const db = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 初始化数据库表结构
function initializeDatabase() {
  // 团队成员表
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      degree TEXT,
      research TEXT NOT NULL,
      email TEXT NOT NULL,
      category TEXT NOT NULL,
      google_scholar TEXT,
      research_gate TEXT,
      orcid TEXT,
      bio TEXT,
      photo_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      join_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 出版物表 - 确保包含is_highlighted字段
  db.exec(`
    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      journal TEXT NOT NULL,
      year INTEGER NOT NULL,
      volume TEXT,
      issue TEXT,
      pages TEXT,
      doi TEXT,
      abstract TEXT,
      pdf_url TEXT,
      is_highlighted INTEGER NOT NULL DEFAULT 0,
      citation_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 出版物关键词表
  db.exec(`
    CREATE TABLE IF NOT EXISTS publication_keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publication_id INTEGER NOT NULL,
      keyword TEXT NOT NULL,
      FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
    )
  `);

  // 出版物-作者关联表
  db.exec(`
    CREATE TABLE IF NOT EXISTS publication_authors (
      publication_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      PRIMARY KEY (publication_id, author_id),
      FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES team_members(id) ON DELETE CASCADE
    )
  `);

  // 项目表
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      funding_source TEXT,
      funding_amount REAL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 项目-成员关联表
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_members (
      project_id INTEGER NOT NULL,
      member_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      PRIMARY KEY (project_id, member_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (member_id) REFERENCES team_members(id) ON DELETE CASCADE
    )
  `);

  // 新闻表
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      publish_date TEXT NOT NULL,
      author TEXT,
      image_url TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 待办事项表
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      due_date TEXT,
      priority TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 专利表
  db.exec(`
    CREATE TABLE IF NOT EXISTS patents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      inventors TEXT NOT NULL,
      inventor_ids TEXT,
      patent_number TEXT NOT NULL,
      application_date TEXT NOT NULL,
      grant_date TEXT,
      abstract TEXT,
      keywords TEXT,
      status TEXT NOT NULL CHECK(status IN ('pending', 'granted', 'expired')),
      type TEXT NOT NULL CHECK(type IN ('invention', 'utility', 'design')),
      pdf_url TEXT,
      is_highlighted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建专利表索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_patents_title ON patents(title);
    CREATE INDEX IF NOT EXISTS idx_patents_inventors ON patents(inventors);
    CREATE INDEX IF NOT EXISTS idx_patents_patent_number ON patents(patent_number);
    CREATE INDEX IF NOT EXISTS idx_patents_application_date ON patents(application_date);
    CREATE INDEX IF NOT EXISTS idx_patents_status ON patents(status);
    CREATE INDEX IF NOT EXISTS idx_patents_type ON patents(type);
    CREATE INDEX IF NOT EXISTS idx_patents_is_highlighted ON patents(is_highlighted);
  `);

  // 更新触发器 - 专利
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_patents_timestamp 
    AFTER UPDATE ON patents
    BEGIN
      UPDATE patents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
}

// 清空现有数据
function clearExistingData() {
  try {
    db.exec('DELETE FROM todos');
    db.exec('DELETE FROM users');
    db.exec('DELETE FROM news');
    db.exec('DELETE FROM project_members');
    db.exec('DELETE FROM projects');
    db.exec('DELETE FROM publication_keywords');
    db.exec('DELETE FROM publication_authors');
    db.exec('DELETE FROM publications');
    db.exec('DELETE FROM team_members');
  } catch (error) {
    console.warn('清空数据时出现错误，可能是表格尚未创建：', error.message);
    // 继续执行，不中断程序
  }
}

// 导入团队成员数据
function importTeamMembers() {
  const stmt = db.prepare(`
    INSERT INTO team_members 
    (id, name, title, degree, research, email, category, is_active, join_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((members) => {
    for (const member of members) {
      stmt.run(
        member.id,
        member.name,
        member.title,
        member.degree || null,
        member.research,
        member.email,
        member.category,
        member.isActive ? 1 : 0,
        member.joinDate
      );
    }
  });

  insertMany(teamMembers);
  console.log(`导入了 ${teamMembers.length} 条团队成员数据`);
}

// 导入出版物数据
function importPublications() {
  // 检查表结构是否存在指定列
  const tableInfo = db.prepare("PRAGMA table_info(publications)").all();
  const columns = tableInfo.map(col => col.name);
  console.log("出版物表结构：", columns);
  
  // 根据实际表结构组织SQL语句
  let sql = `
    INSERT INTO publications 
    (id, title, authors, journal, year, volume, issue, pages, doi`;
  
  // 检查is_highlighted字段是否存在
  if (columns.includes('is_highlighted')) {
    sql += `, is_highlighted`;
  }
  
  sql += `) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?`;
  
  if (columns.includes('is_highlighted')) {
    sql += `, ?`;
  }
  
  sql += `)`;
  
  console.log("执行的SQL语句:", sql);

  const stmt = db.prepare(sql);

  const keywordStmt = db.prepare(`
    INSERT INTO publication_keywords
    (publication_id, keyword)
    VALUES (?, ?)
  `);

  const insertMany = db.transaction((publications) => {
    for (const pub of publications) {
      const params = [
        pub.id,
        pub.title,
        pub.authors,
        pub.journal,
        pub.year,
        pub.volume || null,
        pub.issue || null,
        pub.pages || null,
        pub.doi || null
      ];
      
      // 如果表中有is_highlighted字段，则添加该参数
      if (columns.includes('is_highlighted')) {
        params.push(pub.isHighlighted ? 1 : 0);
      }
      
      stmt.run(...params);

      // 导入关键词
      if (pub.keywords && pub.keywords.length > 0) {
        for (const keyword of pub.keywords) {
          keywordStmt.run(pub.id, keyword);
        }
      }
    }
  });

  insertMany(publications);
  console.log(`导入了 ${publications.length} 条出版物数据`);
}

// 导入项目数据
function importProjects() {
  const stmt = db.prepare(`
    INSERT INTO projects
    (id, title, description, start_date, end_date, funding_source, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((projects) => {
    for (const project of projects) {
      stmt.run(
        project.id,
        project.title,
        project.description,
        project.startDate,
        project.endDate || null,
        project.fundingSource || null,
        project.isActive ? 1 : 0
      );
    }
  });

  insertMany(projects);
  console.log(`导入了 ${projects.length} 条项目数据`);
}

// 导入新闻数据
function importNews() {
  const stmt = db.prepare(`
    INSERT INTO news
    (id, title, content, publish_date, author, image_url, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((newsItems) => {
    for (const newsItem of newsItems) {
      stmt.run(
        newsItem.id,
        newsItem.title,
        newsItem.content,
        newsItem.publishDate,
        newsItem.author || null,
        newsItem.imageUrl || null,
        newsItem.isPublished ? 1 : 0
      );
    }
  });

  insertMany(news);
  console.log(`导入了 ${news.length} 条新闻数据`);
}

// 导入用户数据
function importUsers() {
  const stmt = db.prepare(`
    INSERT INTO users
    (id, username, password, email, role, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((users) => {
    for (const user of users) {
      stmt.run(
        user.id,
        user.username,
        user.password,
        user.email,
        user.role,
        user.isActive ? 1 : 0
      );
    }
  });

  insertMany(users);
  console.log(`导入了 ${users.length} 条用户数据`);
}

// 导入待办事项数据
function importTodos() {
  const stmt = db.prepare(`
    INSERT INTO todos
    (id, title, description, completed, due_date, priority, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((todos) => {
    for (const todo of todos) {
      stmt.run(
        todo.id,
        todo.title,
        todo.description || null,
        todo.completed ? 1 : 0,
        todo.dueDate || null,
        todo.priority || null,
        todo.userId || null
      );
    }
  });

  insertMany(todoItems);
  console.log(`导入了 ${todoItems.length} 条待办事项数据`);
}

// 导入专利数据
function importPatents() {
  const stmt = db.prepare(`
    INSERT INTO patents
    (id, title, inventors, inventor_ids, patent_number, application_date, grant_date,
    abstract, keywords, status, type, pdf_url, is_highlighted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((patents) => {
    for (const patent of patents) {
      stmt.run(
        patent.id,
        patent.title,
        patent.inventors,
        patent.inventor_ids,
        patent.patent_number,
        patent.application_date,
        patent.grant_date,
        patent.abstract,
        patent.keywords,
        patent.status,
        patent.type,
        patent.pdf_url,
        patent.is_highlighted ? 1 : 0
      );
    }
  });

  insertMany(patents);
  console.log(`导入了 ${patents.length} 条专利数据`);
}

// 执行数据导入
export function seedDatabase() {
  try {
    console.log('开始初始化数据库表结构...');
    initializeDatabase();
    
    console.log('开始清空现有数据...');
    clearExistingData();

    console.log('开始导入团队成员数据...');
    importTeamMembers();

    console.log('开始导入出版物数据...');
    importPublications();

    console.log('开始导入项目数据...');
    importProjects();

    console.log('开始导入新闻数据...');
    importNews();

    console.log('开始导入用户数据...');
    importUsers();

    console.log('开始导入待办事项数据...');
    importTodos();

    console.log('开始导入专利数据...');
    importPatents();

    console.log('数据导入完成！');
  } catch (error) {
    console.error('数据导入失败：', error);
  }
}

// 如果作为主模块直接执行，则立即运行种子函数
// 检查脚本是否直接运行而不是被导入
seedDatabase();

// 关闭数据库连接
process.on('exit', () => {
  db.close();
}); 