'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoMenu, IoClose } from 'react-icons/io5';

const navItems = [
  { label: '首页', path: '/' },
  { label: '课题组介绍', path: '/main/about' },
  //{ label: '研究方向', path: '/main/research' },
  { label: '团队成员', path: '/main/team' },
  { label: '科研成果', path: '/main/achievements' },
  { label: '新闻动态', path: '/main/news' },
  //{ label: '联系我们', path: '/main/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const Logo = () => (
    <div className="relative h-12 w-42 mr-3">
      <Image 
        src="/upload/logo.png"
        alt="课题组标志"
        fill
        className="object-contain"
        priority
      />
    </div>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo />
              <span className="text-2xl font-bold text-green-700">侯老师课题组</span>
            </Link>
          </div>
          
          {/* 桌面导航 */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
} 