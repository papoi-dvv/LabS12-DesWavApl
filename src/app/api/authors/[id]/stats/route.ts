import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await params
    const authorId = resolved.id

    const author = await prisma.author.findUnique({ where: { id: authorId } })
    if (!author) return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })

    const totalBooks = await prisma.book.count({ where: { authorId } })

    const first = await prisma.book.findFirst({
      where: { authorId, publishedYear: { not: null } },
      orderBy: { publishedYear: 'asc' },
      select: { title: true, publishedYear: true },
    })

    const latest = await prisma.book.findFirst({
      where: { authorId, publishedYear: { not: null } },
      orderBy: { publishedYear: 'desc' },
      select: { title: true, publishedYear: true },
    })

    const avgPagesAgg = await prisma.book.aggregate({ where: { authorId }, _avg: { pages: true } })
    const averagePages = avgPagesAgg._avg.pages ? Math.round(avgPagesAgg._avg.pages) : 0

    const genresRaw = await prisma.book.findMany({ where: { authorId }, select: { genre: true } })
    const genres = Array.from(new Set(genresRaw.map((g) => g.genre).filter(Boolean))) as string[]

    const longest = await prisma.book.findFirst({ where: { authorId, pages: { not: null } }, orderBy: { pages: 'desc' }, select: { title: true, pages: true } })
    const shortest = await prisma.book.findFirst({ where: { authorId, pages: { not: null } }, orderBy: { pages: 'asc' }, select: { title: true, pages: true } })

    return NextResponse.json({
      authorId,
      authorName: author.name,
      totalBooks,
      firstBook: first ? { title: first.title, year: first.publishedYear ?? null } : null,
      latestBook: latest ? { title: latest.title, year: latest.publishedYear ?? null } : null,
      averagePages,
      genres,
      longestBook: longest ? { title: longest.title, pages: longest.pages ?? 0 } : null,
      shortestBook: shortest ? { title: shortest.title, pages: shortest.pages ?? 0 } : null,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al calcular estadísticas' }, { status: 500 })
  }
}
