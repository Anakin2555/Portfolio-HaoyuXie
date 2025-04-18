import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND_URL = 'http://118.31.186.204:3001/api'

export async function middleware(request: NextRequest) {
  // 只处理 /api 开头的请求
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  try {
    // 构建后端 URL
    const pathname = request.nextUrl.pathname.replace(/^\/api/, '')
    const searchParams = request.nextUrl.searchParams
    const url = `${BACKEND_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    // 转发请求到后端
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    })

    // 获取响应数据
    const data = await response.json()

    // 返回响应
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    )
  }
}

// 配置中间件匹配规则
export const config = {
  matcher: '/api/:path*',
} 