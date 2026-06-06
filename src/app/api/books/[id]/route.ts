import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Enforce a max payload size via Content-Length header when available
const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024 // 10MB

// GET - Obtener un libro específico por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const book = await prisma.book.findUnique({
      where: { id: resolvedParams.id },
      include: { author: true }
    })

    if (!book) return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })
    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el libro' }, { status: 500 })
  }
}

// PUT - Actualizar un libro
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // reject large payloads when Content-Length is provided
    const cl = request.headers.get('content-length')
    if (cl && Number(cl) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }
    const body = await request.json()
    // Validar y parsear números de forma segura
    let publishedYear: number | undefined = undefined
    let pages: number | undefined = undefined
    if (body.publishedYear !== undefined && body.publishedYear !== null && body.publishedYear !== '') {
      const n = Number(body.publishedYear)
      if (!Number.isNaN(n)) publishedYear = n
    }
    if (body.pages !== undefined && body.pages !== null && body.pages !== '') {
      const n = Number(body.pages)
      if (!Number.isNaN(n)) pages = n
    }

    const book = await prisma.book.update({
      where: { id: resolvedParams.id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || null,
        imageData: body.imageData || null,
        isbn: body.isbn || null,
        publishedYear,
        genre: body.genre || null,
        pages,
        authorId: body.authorId || undefined,
      },
      include: { author: true }
    })
    return NextResponse.json(book)
  } catch (error: any) {
    console.error('Error en PUT /api/books/[id]:', error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
}

// DELETE - Eliminar un libro
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    await prisma.book.delete({
      where: { id: resolvedParams.id }
    })
    return NextResponse.json({ message: 'Libro eliminado correctamente' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar el libro' }, { status: 500 })
  }
}