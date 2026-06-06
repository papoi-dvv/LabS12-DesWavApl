import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    let searchParams: URLSearchParams
    try {
      searchParams = new URL(request.url).searchParams
    } catch {
      const host = request.headers.get('host') ?? 'localhost:3000'
      searchParams = new URL(request.url, `http://${host}`).searchParams
    }

    const search = searchParams.get('search') ?? ''
    const genre = searchParams.get('genre') || undefined
    const authorName = searchParams.get('authorName') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limitRaw = Math.max(1, parseInt(searchParams.get('limit') || '10'))
    const limit = Math.min(limitRaw, 50)
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'title' | 'publishedYear' | 'createdAt'
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    const where: any = {}

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    if (genre) {
      where.genre = genre
    }

    if (authorName) {
      where.author = { name: { contains: authorName, mode: 'insensitive' } }
    }

    const [total, data] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }

    return NextResponse.json({ data, pagination })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error en búsqueda de libros' }, { status: 500 })
  }
}
