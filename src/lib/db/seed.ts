import db from './index';
import {
  teamMembers as initialTeamMembers,
  publications as initialPublications,
  projects as initialProjects,
  news as initialNews,
  users as initialUsers,
  todoItems as initialTodoItems
} from '../data/database';

// 清空现有数据
function clearExistingData() {
  db.exec('DELETE FROM todos');
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM news');
  db.exec('DELETE FROM project_members');
  db.exec('DELETE FROM projects');
  db.exec('DELETE FROM publication_keywords');
  db.exec('DELETE FROM publication_authors');
  db.exec('DELETE FROM publications');
  db.exec('DELETE FROM team_members');
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

  insertMany(initialTeamMembers);
  console.log(`导入了 ${initialTeamMembers.length} 条团队成员数据`);
}

// 导入出版物数据
function importPublications() {
  const stmt = db.prepare(`
    INSERT INTO publications 
    (id, title, authors, journal, year, volume, issue, pages, doi, is_highlighted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const keywordStmt = db.prepare(`
    INSERT INTO publication_keywords
    (publication_id, keyword)
    VALUES (?, ?)
  `);

  const insertMany = db.transaction((publications) => {
    for (const pub of publications) {
      stmt.run(
        pub.id,
        pub.title,
        pub.authors,
        pub.journal,
        pub.year,
        pub.volume || null,
        pub.issue || null,
        pub.pages || null,
        pub.doi || null,
        pub.isHighlighted ? 1 : 0
      );

      // 导入关键词
      if (pub.keywords && pub.keywords.length > 0) {
        for (const keyword of pub.keywords) {
          keywordStmt.run(pub.id, keyword);
        }
      }
    }
  });

  insertMany(initialPublications);
  console.log(`导入了 ${initialPublications.length} 条出版物数据`);
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

  insertMany(initialProjects);
  console.log(`导入了 ${initialProjects.length} 条项目数据`);
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

  insertMany(initialNews);
  console.log(`导入了 ${initialNews.length} 条新闻数据`);
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

  insertMany(initialUsers);
  console.log(`导入了 ${initialUsers.length} 条用户数据`);
}

// 执行数据导入
export function seedDatabase() {
  try {
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

    console.log('数据导入完成！');
  } catch (error) {
    console.error('数据导入失败：', error);
  }
}

// 如果直接运行此脚本，则执行数据导入
if (require.main === module) {
  seedDatabase();
} 