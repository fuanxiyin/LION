import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ResearchFeature } from '@/lib/data/models';

const dataFilePath = path.join(process.cwd(), 'data', 'researchFeatures.json');

// 读取所有研究特色
const readResearchFeatures = (): ResearchFeature[] => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data).researchFeatures;
  } catch (error) {
    console.error('读取研究特色数据出错:', error);
    return [];
  }
};

// 保存研究特色数据
const saveResearchFeatures = (researchFeatures: ResearchFeature[]) => {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify({ researchFeatures }, null, 2));
  } catch (error) {
    console.error('保存研究特色数据出错:', error);
  }
};

// 获取单个研究特色
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
    const researchFeatures = readResearchFeatures();
    const researchFeature = researchFeatures.find(feature => feature.id === idNumber);
    
    if (!researchFeature) {
      return NextResponse.json(
        { error: '研究特色不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ researchFeature }, { status: 200 });
  } catch (error) {
    console.error('获取研究特色详情时出错:', error);
    return NextResponse.json(
      { error: '获取研究特色详情失败' },
      { status: 500 }
    );
  }
}

// 更新研究特色
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
    const researchFeatures = readResearchFeatures();
    const index = researchFeatures.findIndex(feature => feature.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究特色不存在' },
        { status: 404 }
      );
    }
    
    // 确保order不为0
    if (data.order !== undefined && data.order <= 0) {
      data.order = 1;
    }
    
    // 更新研究特色
    const updatedResearchFeature = {
      ...researchFeatures[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    researchFeatures[index] = updatedResearchFeature;
    saveResearchFeatures(researchFeatures);
    
    return NextResponse.json({ researchFeature: updatedResearchFeature }, { status: 200 });
  } catch (error) {
    console.error('更新研究特色时出错:', error);
    return NextResponse.json(
      { error: '更新研究特色失败' },
      { status: 500 }
    );
  }
}

// 删除研究特色
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
    const researchFeatures = readResearchFeatures();
    const index = researchFeatures.findIndex(feature => feature.id === idNumber);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '研究特色不存在' },
        { status: 404 }
      );
    }
    
    // 删除研究特色
    researchFeatures.splice(index, 1);
    
    // 重新编号所有研究特色
    // 首先按照原来的order排序
    const sortedFeatures = researchFeatures.sort((a, b) => a.order - b.order);
    
    // 然后重新分配order，从1开始，确保没有0
    sortedFeatures.forEach((feature, idx) => {
      feature.order = idx + 1; // 确保从1开始
      feature.updatedAt = new Date().toISOString();
    });
    
    saveResearchFeatures(sortedFeatures);
    
    return NextResponse.json({ 
      success: true,
      message: '研究特色已删除并重新编号'
    }, { status: 200 });
  } catch (error) {
    console.error('删除研究特色时出错:', error);
    return NextResponse.json(
      { error: '删除研究特色失败' },
      { status: 500 }
    );
  }
} 