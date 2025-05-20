'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGraduationCap, FaResearchgate, FaOrcid, FaGoogle } from 'react-icons/fa';
import { TeamMember } from '@/lib/data/models';
import { useTeamMemberApi } from '@/lib/hooks/api';

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 使用API钩子
  const teamMemberApi = useTeamMemberApi();

  // 加载团队成员数据
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await teamMemberApi.getAll();
        setMembers(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        setError('获取团队成员失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []); // 移除 teamMemberApi 依赖项，只在组件挂载时执行一次

  // 根据激活的类别筛选团队成员
  const filteredMembers = activeCategory === 'all' 
    ? [...members].sort((a, b) => {
        // 类别优先级: professor > associate > postdoc > student
        const categoryOrder = {
          'professor': 1,
          'associate': 2,
          'postdoc': 3,
          'student': 4
        };
        
        // 先按类别排序
        if (categoryOrder[a.category] !== categoryOrder[b.category]) {
          return categoryOrder[a.category] - categoryOrder[b.category];
        }
        
        // 同类别按拼音排序 (通过名字的字符串比较)
        return a.name.localeCompare(b.name, 'zh-CN');
      }) 
    : members.filter(member => member.category === activeCategory)
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

  // 加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">团队成员</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            我们的课题组由教授、副教授、博士后、研究生等组成，形成了一支结构合理、充满活力的研究团队
          </p>
        </motion.div>

        {/* 类别筛选按钮 */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            全部成员
          </button>
          <button
            onClick={() => setActiveCategory('professor')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'professor'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            教授/研究员
          </button>
          <button
            onClick={() => setActiveCategory('associate')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'associate'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            副教授/副研究员
          </button>
          <button
            onClick={() => setActiveCategory('postdoc')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'postdoc'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            博士后
          </button>
          <button
            onClick={() => setActiveCategory('student')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'student'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            研究生
          </button>
        </div>
      </div>

      {/* 团队成员卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member, index) => (
          <div
            key={member.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {/* 头像 */}
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">{member.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-green-600">{member.title}</p>
                    {member.degree && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaGraduationCap className="mr-1" />
                        {member.degree}
                      </p>
                    )}
                  </div>
                </div>

                {/* 研究方向 */}
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">研究方向</h4>
                  <p className="text-sm text-gray-700">{member.research}</p>
                </div>

                {/* 联系方式和学术档案 */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{member.email}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {member.googleScholar && (
                      <a 
                        href={member.googleScholar} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <FaGoogle size={20} />
                      </a>
                    )}
                    {member.researchGate && (
                      <a 
                        href={member.researchGate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-green-600"
                      >
                        <FaResearchgate size={20} />
                      </a>
                    )}
                    {member.orcid && (
                      <a 
                        href={member.orcid} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-green-800"
                      >
                        <FaOrcid size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* 加入我们 */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">加入我们</h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-6">
            我们欢迎对土壤科学和环境修复研究有兴趣的本科生、研究生和博士后加入我们的团队。
            如果您有意向，请将您的简历和研究计划发送至 <span className="text-green-600 font-medium">jthou@mail.hzau.edu.cn</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 