import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los libros
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const genre = searchParams.get('genre')
    const authorId = searchParams.get('authorId')

    const books = await prisma.book.findMany({
      where: {
        ...(genre && { genre }),
        ...(authorId && { authorId }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener libros' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo libro
export async function POST(request: Request) {
  try {
    // reject large payloads when Content-Length is provided
    const cl = request.headers.get('content-length')
    if (cl && Number(cl) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }
    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      imageData,
      isbn,
      publishedYear,
      genre,
      pages,
      authorId
    } = body

    // Validaciones
    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Título y autor son requeridos' },
        { status: 400 }
      )
    }

    if (title.length < 3) {
      return NextResponse.json(
        { error: 'El título debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (pages && pages < 1) {
      return NextResponse.json(
        { error: 'El número de páginas debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Verificar que el autor existe
    const authorExists = await prisma.author.findUnique({
      where: { id: authorId }
    })

    if (!authorExists) {
      return NextResponse.json(
        { error: 'El autor especificado no existe' },
        { status: 404 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        imageData: imageData || null,
        isbn,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre,
        pages: pages ? parseInt(pages) : null,
        authorId,
      },
      include: {
        author: true,
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El ISBN ya existe' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear libro' },
      { status: 500 }
    )
  }
}

// Enforce a max payload size via Content-Length header when available
const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024 // 10MB
