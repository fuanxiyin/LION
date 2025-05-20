'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaLink, FaDownload, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { Publication } from '@/lib/data/models';
import { usePublicationApi } from '@/lib/hooks/publication';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [error, setError] = useState<string | null>(null);

  // 使用新的API钩子
  const publicationApi = usePublicationApi();

  // 加载论文数据
  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        const data = await publicationApi.getAll();
        setPublications(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch publications:', error);
        setError('加载论文数据失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []); // 去掉publicationApi依赖，只在组件挂载时执行一次

  // 提取所有年份并去重
  const uniqueYears = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

  // 根据搜索和过滤条件筛选论文
  const filteredPublications = publications
    .filter(pub => {
      // 按年份过滤
      if (activeYear !== 'all' && pub.year.toString() !== activeYear) {
        return false;
      }
      
      // 按搜索条件过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          pub.title.toLowerCase().includes(query) ||
          pub.authors.toLowerCase().includes(query) ||
          pub.journal.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // 排序
      if (sortOrder === 'asc') {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">发表论文</h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              我们的研究成果发表在国内外重要学术期刊
            </p>
          </motion.div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-4xl font-bold text-green-600">{publications.length}</p>
              <p className="text-gray-600">学术论文</p>
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
                {publications.filter(pub => pub.isHighlighted).length}
              </p>
              <p className="text-gray-600">高被引论文</p>
            </motion.div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-4xl font-bold text-green-600">
                {publications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0)}
              </p>
              <p className="text-gray-600">总引用次数</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 错误信息显示 */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* 筛选和搜索工具 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          {/* 年份筛选 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveYear('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeYear === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {uniqueYears.map(year => (
              <button
                key={year}
                onClick={() => setActiveYear(year.toString())}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeYear === year.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* 搜索和排序 */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="搜索论文、作者或期刊..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={toggleSortOrder}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span>年份</span>
              {sortOrder === 'desc' ? <FaSortDown /> : <FaSortUp />}
            </button>
          </div>
        </div>
      </div>

      {/* 论文列表 */}
      <div className="space-y-6">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub, index) => (
            <div key={pub.id} className="bg-white rounded-lg shadow p-6">
              <div className="motion-safe">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{pub.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">作者: {pub.authors}</p>
                      <p className="text-sm text-green-600 mb-2">期刊: {pub.journal}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {pub.volume}
                        {pub.issue && `(${pub.issue})`}
                        {pub.pages && `: ${pub.pages}`}
                        {pub.year && `, ${pub.year}`}
                      </p>
                      {pub.abstract && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{pub.abstract}</p>
                      )}
                      <div className="flex flex-wrap mt-3 gap-2">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                          >
                            <FaLink className="mr-1" />
                            DOI
                          </a>
                        )}
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
                          >
                            <FaDownload className="mr-1" />
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">没有找到符合条件的论文</p>
          </div>
        )}
      </div>
    </div>
  );
} 