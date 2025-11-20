// Utility functions for API responses

import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json(
      { success: true, data },
      { status }
    );
  }

  static error(message: string, status: number = 500) {
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }

  static notFound(message: string = 'Resource not found') {
    return NextResponse.json(
      { success: false, error: message },
      { status: 404 }
    );
  }

  static badRequest(message: string = 'Bad request') {
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

