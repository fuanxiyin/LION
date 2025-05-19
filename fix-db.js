// 数据库表结构修复脚本
const sqlite = require('better-sqlite3');
const path = require('path');

// 打开数据库连接
console.log('打开数据库连接...');
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = sqlite(dbPath);

try {
  console.log('检查projects表结构...');
  
  // 检查表结构
  const tableInfo = db.prepare("PRAGMA table_info(projects)").all();
  console.log('当前表结构:');
  console.table(tableInfo.map(col => ({ name: col.name, type: col.type })));
  
  // 检查leader字段是否存在
  const leaderColumn = tableInfo.find(col => col.name === 'leader');
  
  if (!leaderColumn) {
    console.log('Leader字段不存在，添加中...');
    
    // 添加leader字段
    db.exec(`
      -- 为projects表添加leader字段
      ALTER TABLE projects ADD COLUMN leader TEXT;
      
      -- 更新索引，支持按负责人搜索
      CREATE INDEX IF NOT EXISTS idx_projects_leader ON projects(leader);
      
      -- 更新现有记录，设置默认负责人信息为空字符串
      UPDATE projects SET leader = '' WHERE leader IS NULL;
    `);
    
    console.log('Leader字段已成功添加');
    
    // 再次检查表结构
    const updatedTableInfo = db.prepare("PRAGMA table_info(projects)").all();
    console.log('更新后的表结构:');
    console.table(updatedTableInfo.map(col => ({ name: col.name, type: col.type })));
  } else {
    console.log('Leader字段已存在，无需修改');
  }
  
  // 检查是否有空值
  const nullLeaders = db.prepare("SELECT COUNT(*) as count FROM projects WHERE leader IS NULL").get();
  if (nullLeaders.count > 0) {
    console.log(`发现${nullLeaders.count}条记录的leader字段为NULL，更新为空字符串...`);
    db.exec("UPDATE projects SET leader = '' WHERE leader IS NULL");
    console.log('更新完成');
  } else {
    console.log('所有记录的leader字段都有值');
  }
  
  console.log('数据库修复成功!');
} catch (err) {
  console.error('数据库修复失败:', err.message);
} finally {
  console.log('关闭数据库连接...');
  db.close();
} 