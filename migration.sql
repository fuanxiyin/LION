-- 为projects表添加leader字段
ALTER TABLE projects ADD COLUMN leader TEXT;

-- 更新索引，支持按负责人搜索
CREATE INDEX IF NOT EXISTS idx_projects_leader ON projects(leader);

-- 更新现有记录，设置默认负责人信息为空字符串
UPDATE projects SET leader = '' WHERE leader IS NULL; 