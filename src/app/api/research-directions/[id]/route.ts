import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ResearchDirection } from '@/lib/data/models';

const dataFilePath = path.join(process.cwd(), 'data', 'researchDirections.json');

// 读取所有研究方向
const readResearchDirections = (): ResearchDirection[] => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data).researchDirections;
  } catch (error) {
    console.error('读取研究方向数据出错:', error);
    return [];
  }
};

// 保存研究方向数据
const saveResearchDirections = (researchDirections: ResearchDirection[]) => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify({ researchDirections }, null, 2));
  } catch (error) {
    console.error('保存研究方向数据出错:', error);
  }
};

// 获取单个研究方向
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    const idNumber = parseInt(id, 10);
    
    // 验证ID
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: '无效的ID' },
        { status: 400 }
      );
    }
    
    // 读取数据
    const researchDirections = readResearchDirections();
    const researchDirection = researchDirections.find(direction => direction.id === idNumber);
    
    if (!researchDirection) {
      return NextResponse.json(
        { error: '研究方向不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ researchDirection }, { status: 200 });
  } catch (error) {
    console.error('获取研究方向详情时出错:', error);
    return NextResponse.json(
      { error: '获取研究方向详情失败' },
      { status: 500 }
    );
  }
}

// 更新研究方向
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    const idNumber = parseInt(id, 10);
    
    // 验证ID
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: '无效的ID' },
        { status: 400 }
      );
    }
    
    // 获取请求数据
    const data = await request.json();
    
    // 读取现有数据
    const researchDirections = readResearchDirections();
    const index = researchDirections.findIndex(direction => direction.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究方向不存在' },
        { status: 404 }
      );
    }
    
    // 确保order不为0
    if (data.order !== undefined && data.order <= 0) {
      data.order = 1;
    }
    
    // 更新研究方向
    const updatedResearchDirection = {
      ...researchDirections[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    researchDirections[index] = updatedResearchDirection;
    saveResearchDirections(researchDirections);
    
    return NextResponse.json({ researchDirection: updatedResearchDirection }, { status: 200 });
  } catch (error) {
    console.error('更新研究方向时出错:', error);
    return NextResponse.json(
      { error: '更新研究方向失败' },
      { status: 500 }
    );
  }
}

// 删除研究方向
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = await context.params.id;
    const idNumber = parseInt(id, 10);
    
    // 验证ID
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: '无效的ID' },
        { status: 400 }
      );
    }
    
    // 读取现有数据
    const researchDirections = readResearchDirections();
    const index = researchDirections.findIndex(direction => direction.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究方向不存在' },
        { status: 404 }
      );
    }
    
    // 删除研究方向
    researchDirections.splice(index, 1);
    
    // 重新编号所有研究方向
    // 首先按照原来的order排序
    const sortedDirections = researchDirections.sort((a, b) => a.order - b.order);
    
    // 然后重新分配order，从1开始，确保没有0
    sortedDirections.forEach((direction, idx) => {
      direction.order = idx + 1; // 确保从1开始
      direction.updatedAt = new Date().toISOString();
    });
    
    saveResearchDirections(sortedDirections);
    
    return NextResponse.json({ 
      success: true,
      message: '研究方向已删除并重新编号'
    }, { status: 200 });
  } catch (error) {
    console.error('删除研究方向时出错:', error);
    return NextResponse.json(
      { error: '删除研究方向失败' },
      { status: 500 }
    );
  }
} 