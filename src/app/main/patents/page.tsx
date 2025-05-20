'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Patent } from '@/lib/data/models';
import { usePatentApi } from '@/lib/hooks/api';
import { FaSearch, FaSpinner } from 'react-icons/fa';

// 使用div替代motion.div，并添加必要的动画属性
const PatentCard = ({ patent, index }: { patent: Patent; index: number }) => (
  <div
    key={patent.id}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    style={{
      opacity: 0,
      transform: `translateY(20px)`,
      animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
    }}
  >
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {patent.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        发明人: {patent.inventors}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        专利号: {patent.patentNumber}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        申请日期: {new Date(patent.applicationDate).toLocaleDateString()}
      </p>
      {patent.grantDate && (
        <p className="text-sm text-gray-600 mb-2">
          授权日期: {new Date(patent.grantDate).toLocaleDateString()}
        </p>
      )}
      <div className="flex items-center space-x-2 mt-4">
        <span className={`px-2 py-1 text-xs rounded ${
          patent.status === 'granted' ? 'bg-green-100 text-green-800' :
          patent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {patent.status === 'granted' ? '已授权' :
           patent.status === 'pending' ? '申请中' : '已过期'}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
          {patent.type === 'invention' ? '发明专利' :
           patent.type === 'utility' ? '实用新型' : '外观设计'}
        </span>
      </div>
      {patent.abstract && (
        <p className="text-sm text-gray-600 mt-4 line-clamp-3">
          {patent.abstract}
        </p>
      )}
      {patent.pdfUrl && (
        <a
          href={patent.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-green-600 hover:text-green-700"
        >
          查看详情
        </a>
      )}
    </div>
  </div>
);

export default function PatentsPage() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const patentApi = usePatentApi();

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        setLoading(true);
        const data = await patentApi.getAll();
        setPatents(data);
        setError(null);
      } catch (err) {
        setError('获取专利列表失败');
        console.error('Failed to fetch patents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatents();
  }, [patentApi]);

  const filteredPatents = patents.filter(patent =>
    patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patent.inventors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patent.patentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">专利</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-8">
            我们的研究成果转化为专利技术
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索专利..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-green-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : filteredPatents.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            {searchQuery ? '没有找到匹配的专利' : '暂无专利记录'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatents.map((patent, index) => (
              <PatentCard patent={patent} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 