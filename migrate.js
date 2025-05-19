// 数据库迁移脚本
const sqlite = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 打开数据库连接
console.log('Opening database connection...');
const db = sqlite(path.join(__dirname, 'data', 'app.db'));

try {
  console.log('Running migrations...');
  
  // 执行数据库迁移
  db.exec(`
    -- 为projects表添加leader字段
    ALTER TABLE projects ADD COLUMN leader TEXT;
    
    -- 更新索引，支持按负责人搜索
    CREATE INDEX IF NOT EXISTS idx_projects_leader ON projects(leader);
    
    -- 更新现有记录，设置默认负责人信息为空字符串
    UPDATE projects SET leader = '' WHERE leader IS NULL;
  `);
  
  console.log('Migration completed successfully!');
} catch (err) {
  console.error('Migration failed:', err.message);
} finally {
  console.log('Closing database connection...');
  db.close();
} 