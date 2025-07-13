import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return new NextResponse('Missing ID', { status: 400 });
  }

  try {
    const fileRes = await axios.get(id, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      maxRedirects: 5,
    });

    const contentType = fileRes.headers['content-type'] || 'application/octet-stream';
    return new NextResponse(fileRes.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Proxy failed', { status: 500 });
  }
}
