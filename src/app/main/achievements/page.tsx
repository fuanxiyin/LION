'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaLink, FaDownload, FaSearch, FaBook, FaTrademark, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Publication, Patent } from '@/lib/data/models';
import { usePublicationApi, usePatentApi } from '@/lib/hooks/api';
import { useSearchParams } from 'next/navigation';

// 创建一个包装组件来使用useSearchParams
function AchievementsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabParam === 'patents' ? 'patents' : 'publications');
  const [activeYear, setActiveYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' 或 'desc'
  const [error, setError] = useState<string | null>(null);

  // 使用API钩子
  const publicationApi = usePublicationApi();
  const patentApi = usePatentApi();

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 并行加载论文和专利数据
        const [publicationsData, patentsData] = await Promise.all([
          publicationApi.getAll(),
          patentApi.getAll()
        ]);
        
        setPublications(publicationsData);
        setPatents(patentsData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('加载数据失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  // 提取所有年份并去重（论文）
  const uniquePublicationYears = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
  
  // 提取所有年份并去重（专利，基于申请日期）
  const uniquePatentYears = [...new Set(patents.map(patent => 
    new Date(patent.applicationDate).getFullYear()
  ))].sort((a, b) => b - a);

  // 当前使用的年份列表
  const uniqueYears = activeTab === 'publications' ? uniquePublicationYears : uniquePatentYears;

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

  // 根据搜索和过滤条件筛选专利
  const filteredPatents = patents
    .filter(patent => {
      // 按年份过滤
      if (activeYear !== 'all') {
        const patentYear = new Date(patent.applicationDate).getFullYear().toString();
        if (patentYear !== activeYear) {
          return false;
        }
      }
      
      // 按搜索条件过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          patent.title.toLowerCase().includes(query) ||
          patent.inventors.toLowerCase().includes(query) ||
          patent.patentNumber.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // 排序
      const aDate = new Date(a.applicationDate).getTime();
      const bDate = new Date(b.applicationDate).getTime();
      
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

  // 当切换标签时重置年份筛选
  useEffect(() => {
    setActiveYear('all');
  }, [activeTab]);

  // 处理URL参数变化
  useEffect(() => {
    if (tabParam === 'patents') {
      setActiveTab('patents');
    } else if (tabParam === 'publications') {
      setActiveTab('publications');
    }
  }, [tabParam]);

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">科研成果</h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              我们的研究成果发表在国内外重要学术期刊，并获得了多项专利技术
            </p>
          </motion.div>
        </div>
      </div>

      {/* 切换标签 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2 text-sm font-medium border ${
              activeTab === 'publications'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-l-lg flex items-center`}
          >
            <FaBook className="mr-2" />
            发表论文
          </button>
          <button
            onClick={() => setActiveTab('patents')}
            className={`px-4 py-2 text-sm font-medium border ${
              activeTab === 'patents'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-r-lg flex items-center`}
          >
            <FaTrademark className="mr-2" />
            专利技术
          </button>
        </div>
      </div>

      {/* 论文部分 */}
      {activeTab === 'publications' && (
        <>
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

          {/* 错误信息显示 */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

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
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                <FaLink className="mr-1" /> DOI
                              </a>
                            )}
                            {pub.pdfUrl && (
                              <a
                                href={pub.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <FaDownload className="mr-1" /> PDF
                              </a>
                            )}
                            {pub.isHighlighted && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                <FaFileAlt className="mr-1" /> 高被引论文
                              </span>
                            )}
                          </div>
                        </div>
                        {pub.citationCount !== undefined && (
                          <div className="ml-4 flex-shrink-0">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg text-center">
                              <p className="text-sm text-gray-500">引用</p>
                              <p className="text-xl font-bold text-green-600">{pub.citationCount}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">未找到相关论文</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* 专利部分 */}
      {activeTab === 'patents' && (
        <>
          {/* 专利统计数据 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="motion-safe">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-4xl font-bold text-green-600">{patents.length}</p>
                  <p className="text-gray-600">专利总数</p>
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
                    {patents.filter(patent => patent.status === 'granted').length}
                  </p>
                  <p className="text-gray-600">已授权专利</p>
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
                    {patents.filter(patent => patent.isHighlighted).length}
                  </p>
                  <p className="text-gray-600">重点专利</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* 专利筛选和搜索工具 */}
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
                    placeholder="搜索专利、发明人或专利号..."
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
                  <span>日期</span>
                  {sortOrder === 'desc' ? <FaSortDown /> : <FaSortUp />}
                </button>
              </div>
            </div>
          </div>

          {/* 专利列表 */}
          <div className="space-y-6">
            {filteredPatents.length > 0 ? (
              filteredPatents.map((patent, index) => (
                <div key={patent.id} className="bg-white rounded-lg shadow p-6">
                  <div className="motion-safe">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{patent.title}</h3>
                          <p className="text-sm text-gray-500 mb-1">发明人: {patent.inventors}</p>
                          <p className="text-sm text-gray-600 mb-1">专利号: {patent.patentNumber}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            申请日期: {new Date(patent.applicationDate).toLocaleDateString()}
                            {patent.grantDate && `, 授权日期: ${new Date(patent.grantDate).toLocaleDateString()}`}
                          </p>
                          {patent.abstract && (
                            <p className="text-gray-600 mb-4 line-clamp-3">{patent.abstract}</p>
                          )}
                          <div className="flex flex-wrap mt-3 gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                              patent.status === 'granted' ? 'bg-green-100 text-green-800' :
                              patent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {patent.status === 'granted' ? '已授权' :
                              patent.status === 'pending' ? '申请中' : '已过期'}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {patent.type === 'invention' ? '发明专利' :
                              patent.type === 'utility' ? '实用新型' : '外观设计'}
                            </span>
                            {patent.pdfUrl && (
                              <a
                                href={patent.pdfUrl.startsWith('http://') || patent.pdfUrl.startsWith('https://') 
                                  ? patent.pdfUrl 
                                  : `https://${patent.pdfUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <FaLink className="mr-1" /> 详情
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
              <div className="text-center py-10">
                <p className="text-gray-500">未找到相关专利</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 主组件使用Suspense边界包装内容组件
export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64">
      <div className="text-xl text-gray-500">加载中...</div>
    </div>}>
      <AchievementsContent />
    </Suspense>
  );
} 