'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { News, ResearchArea } from '@/lib/data/models';

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResearch, setIsLoadingResearch] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      // 获取新闻数据
      const fetchNews = async () => {
        try {
          const res = await fetch('/api/news?limit=3');
          if (!res.ok) {
            throw new Error('获取新闻数据失败');
          }
          const data = await res.json();
          setNews(data.news || []);
        } catch (error) {
          console.error('获取新闻失败:', error);
        } finally {
          setIsLoading(false);
        }
      };

      // 获取研究领域数据
      const fetchResearchAreas = async () => {
        try {
          // 直接使用API请求获取活跃的研究领域，避免使用钩子和缓存引起的问题
          const res = await fetch('/api/research-areas?active=true');
          if (!res.ok) {
            throw new Error('获取研究领域数据失败');
          }
          const data = await res.json();
          // 按照顺序排序
          const sortedAreas = data.researchAreas?.sort((a: ResearchArea, b: ResearchArea) => a.order - b.order) || [];
          setResearchAreas(sortedAreas);
        } catch (error) {
          console.error('获取研究领域失败:', error);
        } finally {
          setIsLoadingResearch(false);
        }
      };

      // 并行获取数据
      await Promise.all([fetchNews(), fetchResearchAreas()]);
    };

    // 获取背景图片列表
    const fetchBackgroundImages = async () => {
      try {
        const res = await fetch('/api/background-images');
        if (!res.ok) {
          // 尝试解析错误信息，如果API返回了JSON格式的错误
          let errorMsg = '获取背景图片失败';
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // 如果错误不是JSON格式，使用通用的res.statusText
            errorMsg = res.statusText || errorMsg;
          }
          throw new Error(errorMsg);
        }
        const data = await res.json();
        if (data.images && Array.isArray(data.images)) {
          setBackgroundImages(data.images);
          if (data.images.length === 0) {
            console.warn('未从API获取到背景图片，或图片列表为空。');
          }
        } else {
          console.error('从API收到的图片数据格式无效:', data);
          setBackgroundImages([]);
        }
      } catch (error) {
        console.error('获取背景图片时出错:', error);
        setBackgroundImages([]); // 出错时设置为空数组，避免页面崩溃
      }
    };

    fetchData();
    fetchBackgroundImages();

  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 背景图片轮播的 Effect
  useEffect(() => {
    // 仅当有多张图片时才启动轮播
    if (backgroundImages.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 8000); // 每 8 秒切换一次
      return () => clearTimeout(timer); // 组件卸载时清除定时器
    }
  }, [currentImageIndex, backgroundImages]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* 英雄区域 */}
        <section 
          className="relative text-white aspect-[21/9] bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: backgroundImages.length > 0 ? `url(${backgroundImages[currentImageIndex]})` : 'none',
          }}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  环境科学与土壤修复
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                  致力于解决土壤污染问题，推动可持续农业发展
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/main/about" 
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 transition-colors"
                  >
                    课题组介绍
                  </Link>
                  <Link 
                    href="/main/achievements" 
                    className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-800 transition-colors"
                  >
                    科研成果
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        {/* 新闻动态 */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-800 mb-2">新闻动态</h3>
              
              {isLoading ? (
                <p className="text-gray-500">加载中...</p>
              ) : news.length > 0 ? (
                <>
                  {news.map((item) => (
                    <div key={item.id} className="mb-4">
                      <h4 className="text-gray-800 font-medium">{item.title}</h4>
                      <p className="text-gray-700 text-sm mb-1">{item.publish_date} | {item.author}</p>
                      <p className="text-gray-700 mb-2 line-clamp-2">{item.content}</p>
                    </div>
                  ))}
                  <Link href="/main/news" className="text-green-600 hover:text-green-800 font-medium">
                    查看更多 →
                  </Link>
                </>
              ) : (
                <p className="text-gray-700 mb-2">暂无新闻动态</p>
              )}
            </div>
          </div>
        </section>

        {/* 研究领域展示 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">研究领域</h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                本课题组围绕国家战略需求和学科前沿问题，开展以下研究
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoadingResearch ? (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">加载中...</p>
                </div>
              ) : researchAreas.length > 0 ? (
                researchAreas.map((area, index) => (
                  <div key={area.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{area.title}</h3>
                        <p className="text-gray-600 mb-4">{area.description}</p>
                        {area.link && (
                          area.link.startsWith('http') ? (
                            <a
                              href={area.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                            >
                              了解更多
                              <svg
                                className="w-4 h-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          ) : (
                            <Link
                              href={area.link}
                              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                            >
                              了解更多
                              <svg
                                className="w-4 h-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          )
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">暂无研究领域数据</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 实验室照片 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">实验室环境</h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                我们拥有先进的仪器设备和良好的科研环境
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {labPhotos.map((photo, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-60 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-gray-600">{photo.caption}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// 示例数据
const labPhotos = [
  { caption: '原子吸收光谱仪实验室' },
  { caption: '微生物培养室' },
  { caption: '土壤样品前处理区' },
];
