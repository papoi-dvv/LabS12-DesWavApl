'use client'

import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'

type Props = Omit<ImageProps, 'src'> & {
  src?: string | null
  kind?: 'book' | 'author'
}

export default function ImageWithFallback({ src, kind = 'book', alt = '', ...rest }: Props) {
  const [failed, setFailed] = useState(false)
  const fallback = kind === 'author' ? '/images/authors/placeholder.svg' : '/images/books/placeholder.svg'
  const effective = !src || failed ? fallback : src

  return (
    // next/image necesita un ancho/alto o layout responsive; confiar en rest props
    <Image src={effective} alt={alt} onError={() => setFailed(true)} {...(rest as any)} />
  )
}
