import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 确定 public/upload/background 目录的绝对路径
    const imageDir = path.join(process.cwd(), 'public', 'upload', 'background');

    // 读取目录内容
    const files = await fs.promises.readdir(imageDir);

    // 筛选出图片文件 (例如 .jpg, .jpeg, .png, .webp)，并映射为公开访问的路径
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/upload/background/${file}`); // 相对于 public 文件夹的路径

    if (imageFiles.length === 0) {
      // 如果没有找到图片，可以打印一个警告或返回一个特定的响应
      console.warn('在 public/upload/background 目录中未找到图片');
      // return NextResponse.json({ error: '未找到图片' }, { status: 404 });
    }

    return NextResponse.json({ images: imageFiles });

  } catch (error) {
    console.error('读取背景图片目录失败:', error);
    // 检查是否是"目录未找到"的错误
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return NextResponse.json({ error: '背景图片目录未找到。' }, { status: 404 });
    }
    return NextResponse.json({ error: '获取背景图片失败' }, { status: 500 });
  }
} 