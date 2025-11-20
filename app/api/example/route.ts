// API Routes - REST API endpoints
// These route handlers use controllers to process requests

import { NextRequest, NextResponse } from 'next/server';
import { ExampleController } from '@/controllers/example.controller';

// GET /api/example
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const result = await ExampleController.getExample(id);
      if (!result) {
        return NextResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(result);
    }

    // Return all examples (implement as needed)
    return NextResponse.json({ message: 'Get all examples' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/example
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await ExampleController.createExample(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/example
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const result = await ExampleController.updateExample(id, data);
    if (!result) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/example
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const success = await ExampleController.deleteExample(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

