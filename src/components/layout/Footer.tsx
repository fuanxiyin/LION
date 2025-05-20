import Link from 'next/link';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeixin, FaWeibo } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 课题组介绍 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">课题组</h3>
            <p className="mb-4 text-gray-300">
              华中农业大学侯静涛老师课题组，致力于土壤科学研究、环境修复与可持续农业发展，为国家粮食安全和生态文明建设提供科技支撑。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaWeixin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaWeibo className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/main/about" className="hover:text-green-400 transition-colors">
                  课题组介绍
                </Link>
              </li>
              <li>
                <Link href="/main/team" className="hover:text-green-400 transition-colors">
                  团队成员
                </Link>
              </li>
              <li>
                <Link href="/main/achievements" className="hover:text-green-400 transition-colors">
                  科研成果
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-green-400" />
                <span>jthou@mail.hzau.edu.cn</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-green-400" />
                <span>+86 123 4567 8901</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-400" />
                <span>华中农业大学资源与环境学院5楼</span>
              </li>
            </ul>
          </div>

          {/* 友情链接 */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">友情链接</h3>
            <ul className="space-y-2">
              <li><a href="https://www.edu.cn" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">中国教育和科研计算机网</a></li>
              <li><a href="https://www.most.gov.cn" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">科学技术部</a></li>
              <li><a href="https://www.nsfc.gov.cn" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">国家自然科学基金委员会</a></li>
              <li><a href="https://www.hzau.edu.cn" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">华中农业大学</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} 华中农业大学侯静涛老师课题组. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
} 