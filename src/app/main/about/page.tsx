'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Project, ResearchDirection, ResearchFeature } from '@/lib/data/models';
import { useProjectApi } from '@/lib/hooks/project';
import { useResearchDirectionApi } from '@/lib/hooks/api';
import { useResearchFeatureApi } from '@/lib/hooks/api';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function AboutPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchDirections, setResearchDirections] = useState<ResearchDirection[]>([]);
  const [researchFeatures, setResearchFeatures] = useState<ResearchFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDirections, setLoadingDirections] = useState(true);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState('all'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // 使用API钩子
  const projectApi = useProjectApi();
  const researchDirectionApi = useResearchDirectionApi();
  const researchFeatureApi = useResearchFeatureApi();

  // 项目筛选区域的引用
  const projectsSectionRef = useRef<HTMLDivElement>(null);

  // 加载研究项目数据
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // 优化：直接获取所有项目数据并在前端进行筛选
        const data = await projectApi.getAll();
        setProjects(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError('获取研究项目失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // 只在组件挂载时获取一次数据

  // 加载研究方向数据
  useEffect(() => {
    const fetchResearchDirections = async () => {
      setLoadingDirections(true);
      try {
        // 强制刷新，确保获取最新数据
        const data = await researchDirectionApi.getActive();
        setResearchDirections(data);
      } catch (error) {
        console.error('Failed to fetch research directions:', error);
      } finally {
        setLoadingDirections(false);
      }
    };

    fetchResearchDirections();
  }, []);

  // 加载研究特色数据
  useEffect(() => {
    const fetchResearchFeatures = async () => {
      setLoadingFeatures(true);
      try {
        // 强制刷新，确保获取最新数据
        const data = await researchFeatureApi.getActive();
        setResearchFeatures(data);
      } catch (error) {
        console.error('Failed to fetch research features:', error);
      } finally {
        setLoadingFeatures(false);
      }
    };

    fetchResearchFeatures();
  }, []);

  // 根据当前状态筛选项目
  const filteredProjects = projects.filter(project => {
    // 活跃状态筛选
    const statusMatch = activeStatus === 'all' || 
      (activeStatus === 'active' && project.isActive) || 
      (activeStatus === 'completed' && !project.isActive);
    
    // 搜索筛选
    const searchMatch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.leader.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // 状态变化处理函数
  const handleStatusChange = (status: string) => {
    // 保持当前滚动位置
    const currentPosition = projectsSectionRef.current?.offsetTop || 0;
    setActiveStatus(status);
    
    // 在状态更新后保持滚动位置
    setTimeout(() => {
      window.scrollTo({ top: currentPosition - 100, behavior: 'auto' });
    }, 0);
  };

  // 搜索处理函数
  const handleSearch = (query: string) => {
    // 保持当前滚动位置
    const currentPosition = projectsSectionRef.current?.offsetTop || 0;
    setSearchQuery(query);
    
    // 在状态更新后保持滚动位置
    setTimeout(() => {
      window.scrollTo({ top: currentPosition - 100, behavior: 'auto' });
    }, 0);
  };

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
      {/* 课题组简介 */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">课题组简介</h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                我们是一个致力于土壤科学和环境修复研究的课题组，拥有先进的实验设备和优秀的研究团队
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="motion-safe">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">研究方向</h2>
                {loadingDirections ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">加载中...</p>
                  </div>
                ) : researchDirections.length > 0 ? (
                  <ul className="space-y-2 text-gray-700">
                    {researchDirections.map((direction) => (
                      <li key={direction.id} className="flex items-start">
                        <svg className="h-6 w-6 mr-2 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{direction.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">暂无研究方向数据</p>
                )}
              </motion.div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="motion-safe">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">研究特色</h2>
                {loadingFeatures ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">加载中...</p>
                  </div>
                ) : researchFeatures.length > 0 ? (
                  <ul className="space-y-4 text-gray-700">
                    {researchFeatures.map((feature) => (
                      <li key={feature.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">暂无研究特色数据</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 科研项目 */}
      <section className="mb-16" id="projects-section" ref={projectsSectionRef}>
        <div className="text-center mb-8">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">代表性科研项目</h2>
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
                <p className="text-4xl font-bold text-green-600">{projects.length}</p>
                <p className="text-gray-600">总项目数</p>
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
                  {projects.filter(project => project.isActive).length}
                </p>
                <p className="text-gray-600">进行中项目</p>
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
                  {projects.filter(project => !project.isActive).length}
                </p>
                <p className="text-gray-600">已结题项目</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 筛选和搜索工具 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            {/* 状态筛选 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeStatus === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                全部项目
              </button>
              <button
                onClick={() => handleStatusChange('active')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                进行中
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                已结题
              </button>
            </div>

            {/* 搜索 */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="搜索项目名称、来源或负责人..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目名称</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project, index) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="motion-safe">
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {project.name}
                          </motion.div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.startDate} 至 {project.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.leader}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.isActive ? (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            进行中
                          </span>
                        ) : (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            已结题
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">没有找到符合条件的项目</p>
          </div>
        )}
      </section>

      {/* 实验设备 */}
      <section>
        <div className="text-center mb-8">
          <div className="motion-safe">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">实验设备</h2>
            </motion.div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="motion-safe">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// 实验设备数据 - 这部分数据不太可能频繁变动，可以保留在前端
const equipment = [
  {
    name: '电感耦合等离子体质谱仪(ICP-MS)',
    description: '用于土壤样品中痕量元素分析，检出限低至ppt级别',
  },
  {
    name: '扫描电子显微镜(SEM)',
    description: '用于观察土壤微观结构和颗粒形态特征',
  },
  {
    name: '气相色谱-质谱联用仪(GC-MS)',
    description: '用于检测土壤中有机污染物的组成和含量',
  },
  {
    name: '同步热分析仪(TG-DTA/DSC)',
    description: '用于研究土壤有机质热分解行为',
  },
  {
    name: '高通量测序平台',
    description: '用于土壤微生物多样性和功能基因分析',
  },
  {
    name: 'X射线衍射仪(XRD)',
    description: '用于分析土壤矿物组成和结晶度',
  },
]; 