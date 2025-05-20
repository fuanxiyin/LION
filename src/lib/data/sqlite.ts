import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 导入所有初始数据
import { 
  teamMembers as initialTeamMembers, 
  publications as initialPublications,
  projects as initialProjects,
  news as initialNews,
  pages as initialPages,
  media as initialMedia,
  users as initialUsers,
  todoItems as initialTodoItems
} from './database'; 

const dbPath = path.join(process.cwd(), 'database.sqlite');

// Ensure the database directory exists if needed (though for root it's not strictly necessary)
// const dbDir = path.dirname(dbPath);
// if (!fs.existsSync(dbDir)) {
//   fs.mkdirSync(dbDir, { recursive: true });
// }

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON'); // Enable foreign key constraints if needed later

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS teamMembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    degree TEXT,
    research TEXT,
    email TEXT UNIQUE,
    category TEXT NOT NULL,
    isActive INTEGER NOT NULL CHECK (isActive IN (0, 1)), -- SQLite uses INTEGER for BOOLEAN
    joinDate TEXT
  );

  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    authors TEXT NOT NULL, -- Store as JSON string or delimited text
    journal TEXT,
    year INTEGER,
    volume TEXT,
    issue TEXT,
    pages TEXT,
    doi TEXT UNIQUE,
    abstract TEXT,
    keywords TEXT, -- Store as JSON string or delimited text
    pdfUrl TEXT,
    isHighlighted INTEGER NOT NULL CHECK (isHighlighted IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source TEXT,
    fundingAmount TEXT,
    startDate TEXT,
    endDate TEXT,
    leader TEXT,
    description TEXT,
    isActive INTEGER NOT NULL CHECK (isActive IN (0, 1))
    -- achievements could be a separate table or stored as JSON string
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    isPublished INTEGER NOT NULL CHECK (isPublished IN (0, 1)),
    imageUrl TEXT
    -- tags could be a separate table or stored as JSON string
  );

  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    isPublished INTEGER NOT NULL CHECK (isPublished IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL -- e.g., 'image', 'video', 'document'
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g., 'admin', 'editor'
    isActive INTEGER NOT NULL CHECK (isActive IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS todoItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL CHECK (completed IN (0, 1))
  );
`);

// Function to populate initial data if tables are empty
function populateInitialData() {
  // Check if any table is empty (we can just check one, assuming they are all populated together)
  const count = (db.prepare('SELECT COUNT(*) as count FROM teamMembers').get() as { count: number }).count;
  
  if (count === 0) {
    console.log('Populating initial data...');

    // Populate teamMembers
    const insertTeamMember = db.prepare(
      'INSERT INTO teamMembers (name, title, degree, research, email, category, isActive, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const insertManyTeamMembers = db.transaction((members) => {
      for (const member of members) {
        insertTeamMember.run(
          member.name,
          member.title,
          member.degree || null,
          member.research || null,
          member.email || null,
          member.category,
          member.isActive ? 1 : 0,
          member.joinDate || null
        );
      }
    });
    insertManyTeamMembers(initialTeamMembers);

    // Populate publications
    const insertPublication = db.prepare(
      'INSERT INTO publications (title, authors, journal, year, volume, issue, pages, doi, abstract, keywords, pdfUrl, isHighlighted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const insertManyPublications = db.transaction((pubs) => {
      for (const pub of pubs) {
        insertPublication.run(
          pub.title,
          JSON.stringify(pub.authors), // Store authors array as JSON
          pub.journal || null,
          pub.year || null,
          pub.volume || null,
          pub.issue || null,
          pub.pages || null,
          pub.doi || null,
          pub.abstract || null,
          JSON.stringify(pub.keywords), // Store keywords array as JSON
          pub.pdfUrl || null,
          pub.isHighlighted ? 1 : 0
        );
      }
    });
    insertManyPublications(initialPublications);

    // Populate projects
     const insertProject = db.prepare(
      'INSERT INTO projects (name, source, fundingAmount, startDate, endDate, leader, description, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const insertManyProjects = db.transaction((projects) => {
      for (const project of projects) {
        insertProject.run(
          project.name,
          project.source || null,
          project.fundingAmount || null,
          project.startDate || null,
          project.endDate || null,
          project.leader || null,
          project.description || null,
          project.isActive ? 1 : 0
        );
      }
    });
    insertManyProjects(initialProjects);

    // Populate news
    const insertNews = db.prepare(
      'INSERT INTO news (title, content, date, author, isPublished, imageUrl) VALUES (?, ?, ?, ?, ?, ?)'
    );
     const insertManyNews = db.transaction((newsItems) => {
      for (const item of newsItems) {
        insertNews.run(
          item.title,
          item.content,
          item.date,
          item.author,
          item.isPublished ? 1 : 0,
          item.imageUrl || null
        );
      }
    });
    insertManyNews(initialNews);

    // Populate pages
    const insertPage = db.prepare(
      'INSERT INTO pages (slug, title, content, isPublished) VALUES (?, ?, ?, ?)'
    );
    const insertManyPages = db.transaction((pages) => {
      for (const page of pages) {
        insertPage.run(
          page.slug,
          page.title,
          page.content,
          page.isPublished ? 1 : 0
        );
      }
    });
    insertManyPages(initialPages);

    // Populate media
    const insertMedia = db.prepare(
      'INSERT INTO media (filename, mimeType, size, url, type) VALUES (?, ?, ?, ?, ?)'
    );
    const insertManyMedia = db.transaction((mediaItems) => {
      for (const item of mediaItems) {
        insertMedia.run(
          item.filename,
          item.mimeType,
          item.size,
          item.url,
          item.type
        );
      }
    });
    insertManyMedia(initialMedia);

    // Populate users
     const insertUser = db.prepare(
      'INSERT INTO users (username, password, role, isActive) VALUES (?, ?, ?, ?)'
    );
    const insertManyUsers = db.transaction((users) => {
      for (const user of users) {
        insertUser.run(
          user.username,
          user.password,
          user.role,
          user.isActive ? 1 : 0
        );
      }
    });
    insertManyUsers(initialUsers);

    // Populate todoItems
    const insertTodoItem = db.prepare(
      'INSERT INTO todoItems (text, completed) VALUES (?, ?)'
    );
    const insertManyTodoItems = db.transaction((todoItems) => {
      for (const item of todoItems) {
        insertTodoItem.run(
          item.text,
          item.completed ? 1 : 0
        );
      }
    });
    insertManyTodoItems(initialTodoItems);

    console.log('All initial data populated.');
  }
}

// Call populateInitialData if you want to automatically add initial data on first run
populateInitialData();

// Close the database connection when the Node.js process exits
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default db; 