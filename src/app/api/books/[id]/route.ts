import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const body = await request.json()
    
    // ... mantienes tus validaciones internas de title y pages igual ...

    const book = await prisma.book.update({
      where: { id: resolvedParams.id },
      data: {
        title: body.title,
        description: body.description,
        isbn: body.isbn,
        publishedYear: body.publishedYear ? parseInt(body.publishedYear) : undefined,
        genre: body.genre,
        pages: body.pages ? parseInt(body.pages) : undefined,
        authorId: body.authorId,
      },
      include: { author: true }
    })
    return NextResponse.json(book)
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar el libro' }, { status: 500 })
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