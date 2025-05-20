'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { News } from '@/lib/data/models';
import { FaNewspaper, FaCalendarAlt, FaUser, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeYear, setActiveYear] = useState('all');

  // 获取所有新闻数据
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) {
          throw new Error('获取新闻数据失败');
        }
        const data = await res.json();
        setNews(data.news || []);
      } catch (error) {
        console.error('获取新闻失败:', error);
        setError('获取新闻数据时出错，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);
  
  // 提取所有年份并去重
  const uniqueYears = [...new Set(news.map(item => 
    new Date(item.publish_date).getFullYear())
  )].sort((a, b) => b - a);
  
  // 根据搜索和过滤条件筛选新闻
  const filteredNews = news
    .filter(item => {
      // 按年份过滤
      if (activeYear !== 'all') {
        const newsYear = new Date(item.publish_date).getFullYear().toString();
        if (newsYear !== activeYear) {
          return false;
        }
      }
      
      // 按搜索条件过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // 排序
      const aDate = new Date(a.publish_date).getTime();
      const bDate = new Date(b.publish_date).getTime();
      
      if (sortOrder === 'asc') {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    });
  
  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="motion-safe">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">新闻动态</h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              了解我们课题组的最新动态、科研进展和学术活动
            </p>
          </motion.div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-4xl font-bold text-green-600">{news.length}</p>
              <p className="text-gray-600">新闻报道</p>
            </motion.div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-4xl font-bold text-green-600">
                {uniqueYears.length}
              </p>
              <p className="text-gray-600">覆盖年份</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 过滤和搜索工具栏 */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* 年份筛选 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-700">年份:</span>
            <button
              onClick={() => setActiveYear('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                activeYear === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {uniqueYears.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year.toString())}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeYear === year.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          
          {/* 搜索框和排序 */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索新闻..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={toggleSortOrder}
              className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              排序
              {sortOrder === 'asc' ? (
                <FaSortUp className="ml-1" />
              ) : (
                <FaSortDown className="ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      <span>{item.publish_date}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  <div className="prose prose-green max-w-none text-gray-700 mb-4">
                    <p>{item.content}</p>
                  </div>
                  {item.imageUrl && (
                    <div className="mt-4">
                      <a 
                        href={item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://') 
                          ? item.imageUrl 
                          : `https://${item.imageUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        阅读相关文章
                        <svg 
                          className="ml-2 -mr-1 h-4 w-4" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <p className="text-yellow-700 flex items-center">
            <FaNewspaper className="mr-2" />
            未找到匹配的新闻动态
          </p>
        </div>
      )}

      {/* 返回主页链接 */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-green-600 hover:text-green-800 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          返回主页
        </Link>
      </div>
    </div>
  );
} 