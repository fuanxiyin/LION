import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ResearchArea } from '@/lib/data/models';

const dataFilePath = path.join(process.cwd(), 'data', 'researchAreas.json');

// 读取所有研究领域
const readResearchAreas = (): ResearchArea[] => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data).researchAreas;
  } catch (error) {
    console.error('读取研究领域数据出错:', error);
    return [];
  }
};

// 保存研究领域数据
const saveResearchAreas = (researchAreas: ResearchArea[]) => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify({ researchAreas }, null, 2));
  } catch (error) {
    console.error('保存研究领域数据出错:', error);
  }
};

// 获取单个研究领域
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const idNumber = parseInt(id, 10);
    
    // 验证ID
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: '无效的ID' },
        { status: 400 }
      );
    }
    
    // 读取数据
    const researchAreas = readResearchAreas();
    const researchArea = researchAreas.find(area => area.id === idNumber);
    
    if (!researchArea) {
      return NextResponse.json(
        { error: '研究领域不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ researchArea }, { status: 200 });
  } catch (error) {
    console.error('获取研究领域详情时出错:', error);
    return NextResponse.json(
      { error: '获取研究领域详情失败' },
      { status: 500 }
    );
  }
}

// 更新研究领域
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
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
    const researchAreas = readResearchAreas();
    const index = researchAreas.findIndex(area => area.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究领域不存在' },
        { status: 404 }
      );
    }
    
    // 更新研究领域
    const updatedResearchArea = {
      ...researchAreas[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // 确保order不为0
    if (updatedResearchArea.order <= 0) {
      updatedResearchArea.order = 1;
    }
    
    researchAreas[index] = updatedResearchArea;
    saveResearchAreas(researchAreas);
    
    return NextResponse.json({ researchArea: updatedResearchArea }, { status: 200 });
  } catch (error) {
    console.error('更新研究领域时出错:', error);
    return NextResponse.json(
      { error: '更新研究领域失败' },
      { status: 500 }
    );
  }
}

// 删除研究领域
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 正确处理异步参数
    const id = context.params.id;
    const idNumber = parseInt(id, 10);
    
    // 验证ID
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { error: '无效的ID' },
        { status: 400 }
      );
    }
    
    // 读取现有数据
    const researchAreas = readResearchAreas();
    const index = researchAreas.findIndex(area => area.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究领域不存在' },
        { status: 404 }
      );
    }
    
    // 删除研究领域
    researchAreas.splice(index, 1);
    
    // 重新编号所有研究领域
    // 首先按照原来的order排序
    const sortedAreas = researchAreas.sort((a, b) => a.order - b.order);
    
    // 然后重新分配order，从1开始，确保没有0
    sortedAreas.forEach((area, idx) => {
      area.order = idx + 1; // 确保从1开始
      area.updatedAt = new Date().toISOString();
    });
    
    saveResearchAreas(sortedAreas);
    
    return NextResponse.json({ 
      success: true,
      message: '研究领域已删除并重新编号'
    }, { status: 200 });
  } catch (error) {
    console.error('删除研究领域时出错:', error);
    return NextResponse.json(
      { error: '删除研究领域失败' },
      { status: 500 }
    );
  }
} 