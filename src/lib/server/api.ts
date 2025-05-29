// 'use server';

import {
  TeamMember,
  Publication,
  Project,
  News,
  Page,
  Media,
  User,
  TodoItem
} from '../data/models';

import {
  teamMembers as initialTeamMembers,
  publications as initialPublications,
  projects as initialProjects,
  news as initialNews,
  pages as initialPages,
  media as initialMedia,
  users as initialUsers,
  todoItems as initialTodoItems
} from '../data/database';

// 在客户端获取localStorage数据的辅助函数
const getStorageData = <T>(key: string, initialData: T[]): T[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      // 初始化数据
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  } catch (error) {
    console.error(`Error accessing localStorage for key ${key}:`, error);
  }
  return [...initialData];
};

// 保存数据到localStorage的辅助函数
const saveStorageData = <T>(key: string, data: T[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// 团队成员 API 函数
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return getStorageData('teamMembers', initialTeamMembers);
}

export async function getTeamMemberById(id: number): Promise<TeamMember | null> {
  const members = getStorageData('teamMembers', initialTeamMembers);
  const member = members.find(m => m.id === id);
  return member || null;
}

export async function createTeamMember(data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  const members = getStorageData('teamMembers', initialTeamMembers);
  const newId = Math.max(...members.map(m => m.id), 0) + 1;
  const newMember = { ...data, id: newId } as TeamMember;
  members.push(newMember);
  saveStorageData('teamMembers', members);
  return { ...newMember };
}

export async function updateTeamMember(id: number, data: Partial<TeamMember>): Promise<boolean> {
  const members = getStorageData('teamMembers', initialTeamMembers);
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...data };
    saveStorageData('teamMembers', members);
    return true;
  }
  return false;
}

export async function deleteTeamMember(id: number): Promise<boolean> {
  const members = getStorageData('teamMembers', initialTeamMembers);
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members.splice(index, 1);
    saveStorageData('teamMembers', members);
    return true;
  }
  return false;
}

// 论文 API 函数
export async function getAllPublications(): Promise<Publication[]> {
  return getStorageData('publications', initialPublications);
}

export async function getPublicationById(id: number): Promise<Publication | null> {
  const publications = getStorageData('publications', initialPublications);
  const pub = publications.find(p => p.id === id);
  return pub || null;
}

export async function createPublication(data: Omit<Publication, 'id'>): Promise<Publication> {
  const publications = getStorageData('publications', initialPublications);
  const newId = Math.max(...publications.map(p => p.id), 0) + 1;
  const newPublication = { ...data, id: newId } as Publication;
  publications.push(newPublication);
  saveStorageData('publications', publications);
  return { ...newPublication };
}

export async function updatePublication(id: number, data: Partial<Publication>): Promise<boolean> {
  const publications = getStorageData('publications', initialPublications);
  const index = publications.findIndex(p => p.id === id);
  if (index !== -1) {
    publications[index] = { ...publications[index], ...data };
    saveStorageData('publications', publications);
    return true;
  }
  return false;
}

export async function deletePublication(id: number): Promise<boolean> {
  const publications = getStorageData('publications', initialPublications);
  const index = publications.findIndex(p => p.id === id);
  if (index !== -1) {
    publications.splice(index, 1);
    saveStorageData('publications', publications);
    return true;
  }
  return false;
}

// 项目 API 函数
export async function getAllProjects(): Promise<Project[]> {
  return getStorageData('projects', initialProjects);
}

export async function getProjectById(id: number): Promise<Project | null> {
  const projects = getStorageData('projects', initialProjects);
  const project = projects.find(p => p.id === id);
  return project || null;
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  const projects = getStorageData('projects', initialProjects);
  const newId = Math.max(...projects.map(p => p.id), 0) + 1;
  const newProject = { ...data, id: newId } as Project;
  projects.push(newProject);
  saveStorageData('projects', projects);
  return { ...newProject };
}

export async function updateProject(id: number, data: Partial<Project>): Promise<boolean> {
  const projects = getStorageData('projects', initialProjects);
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...data };
    saveStorageData('projects', projects);
    return true;
  }
  return false;
}

export async function deleteProject(id: number): Promise<boolean> {
  const projects = getStorageData('projects', initialProjects);
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects.splice(index, 1);
    saveStorageData('projects', projects);
    return true;
  }
  return false;
}

// 新闻 API 函数
export async function getAllNews(): Promise<News[]> {
  return getStorageData('news', initialNews);
}

export async function getNewsById(id: number): Promise<News | null> {
  const news = getStorageData('news', initialNews);
  const item = news.find(n => n.id === id);
  return item || null;
}

export async function createNews(data: Omit<News, 'id'>): Promise<News> {
  const news = getStorageData('news', initialNews);
  const newId = Math.max(...news.map(n => n.id), 0) + 1;
  const newNews = { ...data, id: newId } as News;
  news.push(newNews);
  saveStorageData('news', news);
  return { ...newNews };
}

export async function updateNews(id: number, data: Partial<News>): Promise<boolean> {
  const news = getStorageData('news', initialNews);
  const index = news.findIndex(n => n.id === id);
  if (index !== -1) {
    news[index] = { ...news[index], ...data };
    saveStorageData('news', news);
    return true;
  }
  return false;
}

export async function deleteNews(id: number): Promise<boolean> {
  const news = getStorageData('news', initialNews);
  const index = news.findIndex(n => n.id === id);
  if (index !== -1) {
    news.splice(index, 1);
    saveStorageData('news', news);
    return true;
  }
  return false;
}

// 待办事项 API 函数
export async function getAllTodos(): Promise<TodoItem[]> {
  return getStorageData('todoItems', initialTodoItems);
}

export async function getTodoById(id: number): Promise<TodoItem | null> {
  const todos = getStorageData('todoItems', initialTodoItems);
  const item = todos.find(t => t.id === id);
  return item || null;
}

export async function createTodo(data: Omit<TodoItem, 'id'>): Promise<TodoItem> {
  const todos = getStorageData('todoItems', initialTodoItems);
  const newId = Math.max(...todos.map(t => t.id), 0) + 1;
  const newTodo = { ...data, id: newId } as TodoItem;
  todos.push(newTodo);
  saveStorageData('todoItems', todos);
  return { ...newTodo };
}

export async function updateTodo(id: number, data: Partial<TodoItem>): Promise<boolean> {
  const todos = getStorageData('todoItems', initialTodoItems);
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...data };
    saveStorageData('todoItems', todos);
    return true;
  }
  return false;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const todos = getStorageData('todoItems', initialTodoItems);
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveStorageData('todoItems', todos);
    return true;
  }
  return false;
}

export async function toggleTodoComplete(id: number): Promise<boolean> {
  const todos = getStorageData('todoItems', initialTodoItems);
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      completed: !todos[index].completed
    };
    saveStorageData('todoItems', todos);
    return true;
  }
  return false;
}

// 用户 API 函数
export async function loginUser(username: string, password: string): Promise<User | null> {
  const users = getStorageData('users', initialUsers);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return { ...user, password: '' }; // 返回时不包含密码
  }
  return null;
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  const users = getStorageData('users', initialUsers);
  return users.map(u => ({ ...u, password: '' }));
}