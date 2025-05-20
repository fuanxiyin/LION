import { 
  TeamMember, 
  Publication, 
  Project, 
  News, 
  Page, 
  Media, 
  User, 
  TodoItem 
} from './models';

import { 
  teamMembers, 
  publications, 
  projects, 
  news,
  pages,
  media,
  users,
  todoItems
} from './database';

// 团队成员API
export const teamMemberApi = {
  // 获取所有团队成员
  getAll: async (): Promise<TeamMember[]> => {
    // 尝试从localStorage获取数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('teamMembers');
      if (storedData) {
        return Promise.resolve(JSON.parse(storedData));
      }
      // 如果没有储存的数据，初始化并保存
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    }
    return Promise.resolve([...teamMembers]);
  },

  // 获取单个团队成员
  getById: async (id: number): Promise<TeamMember | null> => {
    let members = teamMembers;
    
    // 尝试从localStorage获取数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('teamMembers');
      if (storedData) {
        members = JSON.parse(storedData);
      }
    }
    
    const member = members.find(m => m.id === id);
    return Promise.resolve(member || null);
  },

  // 创建新团队成员
  create: async (data: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    let members = [...teamMembers];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('teamMembers');
      if (storedData) {
        members = JSON.parse(storedData);
      }
    }
    
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    const newMember = { ...data, id: newId } as TeamMember;
    members.push(newMember);
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamMembers', JSON.stringify(members));
    }
    
    return Promise.resolve({ ...newMember });
  },

  // 更新团队成员
  update: async (id: number, data: Partial<TeamMember>): Promise<boolean> => {
    let members = [...teamMembers];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('teamMembers');
      if (storedData) {
        members = JSON.parse(storedData);
      }
    }
    
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...data };
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('teamMembers', JSON.stringify(members));
      }
      
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  // 删除团队成员
  delete: async (id: number): Promise<boolean> => {
    let members = [...teamMembers];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('teamMembers');
      if (storedData) {
        members = JSON.parse(storedData);
      }
    }
    
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members.splice(index, 1);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('teamMembers', JSON.stringify(members));
      }
      
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};

// 论文API
export const publicationApi = {
  // 获取所有论文
  getAll: async (): Promise<Publication[]> => {
    const response = await fetch('/api/publications');
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    return await response.json();
  },

  // 获取单个论文
  getById: async (id: number): Promise<Publication | null> => {
    const response = await fetch(`/api/publications/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch publication');
    }
    return await response.json();
  },

  // 创建新论文
  create: async (data: Omit<Publication, 'id'>): Promise<Publication> => {
    const response = await fetch('/api/publications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create publication');
    }
    
    return await response.json();
  },

  // 更新论文
  update: async (id: number, data: Partial<Publication>): Promise<boolean> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error('Failed to update publication');
    }
    
    const result = await response.json();
    return result.success;
  },

  // 删除论文
  delete: async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error('Failed to delete publication');
    }
    
    const result = await response.json();
    return result.success;
  }
};

// 项目API
export const projectApi = {
  // 获取所有项目
  getAll: async (): Promise<Project[]> => {
    // 尝试从localStorage获取数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('projects');
      if (storedData) {
        return Promise.resolve(JSON.parse(storedData));
      }
      // 如果没有储存的数据，初始化并保存
      localStorage.setItem('projects', JSON.stringify(projects));
    }
    return Promise.resolve([...projects]);
  },

  // 获取单个项目
  getById: async (id: number): Promise<Project | null> => {
    let projs = projects;
    
    // 尝试从localStorage获取数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('projects');
      if (storedData) {
        projs = JSON.parse(storedData);
      }
    }
    
    const project = projs.find(p => p.id === id);
    return Promise.resolve(project || null);
  },

  // 创建新项目
  create: async (data: Omit<Project, 'id'>): Promise<Project> => {
    let projs = [...projects];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('projects');
      if (storedData) {
        projs = JSON.parse(storedData);
      }
    }
    
    const newId = Math.max(...projs.map(p => p.id), 0) + 1;
    const newProject = { ...data, id: newId } as Project;
    projs.push(newProject);
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projs));
    }
    
    return Promise.resolve({ ...newProject });
  },

  // 更新项目
  update: async (id: number, data: Partial<Project>): Promise<boolean> => {
    let projs = [...projects];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('projects');
      if (storedData) {
        projs = JSON.parse(storedData);
      }
    }
    
    const index = projs.findIndex(p => p.id === id);
    if (index !== -1) {
      projs[index] = { ...projs[index], ...data };
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects', JSON.stringify(projs));
      }
      
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  // 删除项目
  delete: async (id: number): Promise<boolean> => {
    let projs = [...projects];
    
    // 尝试从localStorage获取现有数据
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('projects');
      if (storedData) {
        projs = JSON.parse(storedData);
      }
    }
    
    const index = projs.findIndex(p => p.id === id);
    if (index !== -1) {
      projs.splice(index, 1);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects', JSON.stringify(projs));
      }
      
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};

// 新闻API
export const newsApi = {
  // 获取所有新闻
  getAll: async (): Promise<News[]> => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      return data.news || [];
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  },

  // 获取单个新闻
  getById: async (id: number): Promise<News | null> => {
    try {
      const response = await fetch(`/api/news/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch news with id ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch news with id ${id}:`, error);
      return null;
    }
  },

  // 创建新新闻
  create: async (data: Omit<News, 'id'>): Promise<News> => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create news');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create news:', error);
      throw error;
    }
  },

  // 更新新闻
  update: async (id: number, data: Partial<News>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update news with id ${id}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Failed to update news with id ${id}:`, error);
      return false;
    }
  },

  // 删除新闻
  delete: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete news with id ${id}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Failed to delete news with id ${id}:`, error);
      return false;
    }
  }
};

// 待办事项API
export const todoApi = {
  // 获取所有待办事项
  getAll: async (): Promise<TodoItem[]> => {
    return Promise.resolve([...todoItems]);
  },
  
  // 获取单个待办事项
  getById: async (id: number): Promise<TodoItem | null> => {
    const item = todoItems.find(t => t.id === id);
    return Promise.resolve(item || null);
  },
  
  // 创建新待办事项
  create: async (data: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    const newId = Math.max(...todoItems.map(t => t.id), 0) + 1;
    const newTodo = { ...data, id: newId } as TodoItem;
    todoItems.push(newTodo);
    return Promise.resolve({ ...newTodo });
  },
  
  // 更新待办事项
  update: async (id: number, data: Partial<TodoItem>): Promise<boolean> => {
    const index = todoItems.findIndex(t => t.id === id);
    if (index !== -1) {
      todoItems[index] = { ...todoItems[index], ...data };
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
  
  // 删除待办事项
  delete: async (id: number): Promise<boolean> => {
    const index = todoItems.findIndex(t => t.id === id);
    if (index !== -1) {
      todoItems.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};

// 用户API
export const userApi = {
  // 用户登录
  login: async (username: string, password: string): Promise<User | null> => {
    // 从database.mjs导入的users数组中查找匹配的用户
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return Promise.resolve({ ...user, password: '' }); // 返回时不包含密码
    }
    return Promise.resolve(null);
  },
  
  // 获取所有用户 - 返回不包含密码的用户列表
  getAll: async (): Promise<Omit<User, 'password'>[]> => {
    return Promise.resolve(users.map(u => ({ ...u, password: '' })));
  }
}; 