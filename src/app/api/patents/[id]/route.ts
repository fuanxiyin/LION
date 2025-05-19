import { NextResponse } from 'next/server';
import { getPatentById, updatePatent, deletePatent } from '@/lib/db/patents';

// GET /api/patents/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const patent = await getPatentById(id);
    
    if (!patent) {
      return NextResponse.json(
        { error: '专利不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(patent);
  } catch (error) {
    console.error('Failed to fetch patent:', error);
    return NextResponse.json(
      { error: '获取专利信息失败' },
      { status: 500 }
    );
  }
}

// PUT /api/patents/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    const success = await updatePatent(id, data);

    if (!success) {
      return NextResponse.json(
        { error: '专利不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update patent:', error);
    return NextResponse.json(
      { error: '更新专利失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/patents/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const success = await deletePatent(id);

    if (!success) {
      return NextResponse.json(
        { error: '专利不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete patent:', error);
    return NextResponse.json(
      { error: '删除专利失败' },
      { status: 500 }
    );
  }
}

// PATCH /api/patents/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    const success = await updatePatent(id, data);

    if (!success) {
      return NextResponse.json(
        { error: '专利不存在' },
        { status: 404 }
      );
    }

    // 获取更新后的专利数据
    const updatedPatent = await getPatentById(id);
    return NextResponse.json(updatedPatent);
  } catch (error) {
    console.error('Failed to update patent:', error);
    return NextResponse.json(
      { error: '更新专利失败' },
      { status: 500 }
    );
  }
} 